import { readFile, writeFile } from 'node:fs/promises';

const username = process.env.GITHUB_CONTRIBUTIONS_USER ?? 'heyimcarlos';
const year = Number.parseInt(process.env.GITHUB_CONTRIBUTIONS_YEAR ?? String(new Date().getUTCFullYear()), 10);
const outputPath = new URL('../src/data/github-contributions.json', import.meta.url);
const contributionUrl = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  timeZone: 'UTC',
});

const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match?.[1] ?? '';
};

const cleanText = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const parseTooltipLabels = (html) => {
  const labels = new Map();
  const pattern = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;

  for (const match of html.matchAll(pattern)) {
    labels.set(match[1], cleanText(match[2]));
  }

  return labels;
};

const parseContributionCount = (html) => {
  const match = html.match(
    /<h2\b[^>]*id="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/,
  );
  if (!match) return undefined;

  const text = cleanText(match[1]);
  return text.match(/^([\d,]+)/)?.[1];
};

const toLevel = (value) => {
  const level = Number.parseInt(value, 10);
  return level >= 0 && level <= 4 ? level : 0;
};

const parseDaysFromHtml = (html) => {
  const labels = parseTooltipLabels(html);
  const days = [];
  const pattern =
    /<td\b(?=[^>]*\bclass="[^"]*\bContributionCalendar-day\b[^"]*")[^>]*><\/td>/g;

  for (const match of html.matchAll(pattern)) {
    const tag = match[0];
    const id = getAttribute(tag, 'id');
    const position = id.match(/contribution-day-component-(\d+)-(\d+)/);

    if (!position) continue;

    const date = getAttribute(tag, 'data-date');
    if (!date) continue;

    days.push({
      date,
      day: Number.parseInt(position[1], 10),
      week: Number.parseInt(position[2], 10),
      level: toLevel(getAttribute(tag, 'data-level')),
      label: labels.get(id) ?? `${date}: contribution level ${getAttribute(tag, 'data-level')}`,
    });
  }

  return days;
};

const getMonthLabel = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`));

const buildMonths = (days, weekCount) => {
  const months = [];

  for (let week = 0; week < weekCount; week += 1) {
    const firstDayInWeek = days.find((day) => day.week === week);
    if (!firstDayInWeek) continue;

    const label = getMonthLabel(firstDayInWeek.date);
    const current = months.at(-1);

    if (current?.label === label) {
      current.span += 1;
    } else {
      months.push({ label, span: 1 });
    }
  }

  return months;
};

const buildGrid = (days, weekCount) => {
  const dayByPosition = new Map(days.map((day) => [`${day.day}:${day.week}`, day]));

  return Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: weekCount }, (_, week) => dayByPosition.get(`${day}:${week}`) ?? null),
  );
};

const buildSnapshot = ({ summary, days, source }) => {
  if (days.length === 0) {
    throw new Error('No contribution days found.');
  }

  const weekCount = Math.max(...days.map((day) => day.week)) + 1;

  return {
    username,
    year,
    fetchedAt: new Date().toISOString(),
    source,
    summary,
    weekCount,
    months: buildMonths(days, weekCount),
    grid: buildGrid(days, weekCount),
  };
};

const fetchHtmlSnapshot = async () => {
  const response = await fetch(contributionUrl, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'heyimcarlos.dev',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub contributions HTML returned ${response.status}.`);
  }

  const html = await response.text();
  const days = parseDaysFromHtml(html);
  const contributionCount = parseContributionCount(html) ?? '0';

  return buildSnapshot({
    summary: `${contributionCount} contributions in ${year}`,
    days,
    source: 'github-html',
  });
};

const getOrdinalSuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const formatGraphqlLabel = (date, count) => {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  const month = monthFormatter.format(parsedDate);
  const day = parsedDate.getUTCDate();
  const formattedDate = `${month} ${day}${getOrdinalSuffix(day)}`;

  if (count === 0) return `No contributions on ${formattedDate}.`;
  if (count === 1) return `1 contribution on ${formattedDate}.`;
  return `${count.toLocaleString('en-US')} contributions on ${formattedDate}.`;
};

const graphqlLevelToNumber = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const fetchGraphqlSnapshot = async () => {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN or GH_TOKEN is required for GraphQL fallback.');
  }

  const query = `
    query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'heyimcarlos.dev',
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL returned ${response.status}.`);
  }

  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join('; '));
  }

  const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    throw new Error(`No contribution calendar found for ${username}.`);
  }

  const days = calendar.weeks.flatMap((week, weekIndex) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      day: day.weekday,
      week: weekIndex,
      level: graphqlLevelToNumber[day.contributionLevel] ?? 0,
      label: formatGraphqlLabel(day.date, day.contributionCount),
    })),
  );

  return buildSnapshot({
    summary: `${calendar.totalContributions.toLocaleString('en-US')} contributions in ${year}`,
    days,
    source: 'github-graphql',
  });
};

const updateSnapshot = async () => {
  let snapshot;

  try {
    snapshot = await fetchHtmlSnapshot();
  } catch (htmlError) {
    console.warn(`HTML contribution fetch failed: ${htmlError.message}`);
    snapshot = await fetchGraphqlSnapshot();
  }

  const existingSnapshot = await readExistingSnapshot();
  if (existingSnapshot && toComparableSnapshot(existingSnapshot) === toComparableSnapshot(snapshot)) {
    console.log(`Contribution snapshot is already current (${existingSnapshot.summary}).`);
    return;
  }

  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${snapshot.summary} from ${snapshot.source}.`);
};

const readExistingSnapshot = async () => {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return undefined;
  }
};

const toComparableSnapshot = (snapshot) => {
  const { fetchedAt, source, ...contributionData } = snapshot;
  return JSON.stringify(contributionData);
};

await updateSnapshot();
