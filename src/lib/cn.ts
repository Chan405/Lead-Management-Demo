export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter((item): item is string => Boolean(item)).join(" ");
}
