export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const slugify = (str: string) => {
  return str.toLowerCase().split(' ').join('-')
}
