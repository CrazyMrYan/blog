import { useSiteData } from "vitepress";
export const hashRE = /#.*$/;
export const extRE = /\.(md|html)$/;
export const endingSlashRE = /\/$/;
export const outboundRE = /^[a-z]+:/i;
export function withBase(path) {
  return (useSiteData().value.base + path).replace(/\/+/g, "/");
}
export function isExternal(path) {
  return outboundRE.test(path);
}
export function isActive(route, path) {
  if (path === undefined) {
    return false;
  }
  const routePath = normalize(route.path);
  const pagePath = normalize(path);
  return routePath === pagePath;
}
export function normalize(path) {
  return decodeURI(path).replace(hashRE, "").replace(extRE, "");
}
export function joinUrl(base, path) {
  const baseEndsWithSlash = base.endsWith("/");
  const pathStartsWithSlash = path.startsWith("/");
  if (baseEndsWithSlash && pathStartsWithSlash) {
    return base.slice(0, -1) + path;
  }
  if (!baseEndsWithSlash && !pathStartsWithSlash) {
    return `${base}/${path}`;
  }
  return base + path;
}
/**
 * get the path without filename (the last segment). for example, if the given
 * path is `/guide/getting-started.html`, this method will return `/guide/`.
 * Always with a trailing slash.
 */
export function getPathDirName(path) {
  const segments = path.split("/");
  if (segments[segments.length - 1]) {
    segments.pop();
  }
  return ensureEndingSlash(segments.join("/"));
}
export function ensureEndingSlash(path) {
  return /(\.html|\/)$/.test(path) ? path : `${path}/`;
}
export function parseMarkdownList(pages) {
  return pages;
}
export function useYearSort(pages) {
  const data = [];
  let year = 0;
  let num = -1;
  for (let index = 0; index < pages.length; index++) {
    const element = pages[index];
    const y = element.frontMatter.date.split("-")[0];
    if (y == year) {
      data[num].push(element);
    } else {
      num++;
      data[num] = [];
      data[num].push(element);
      year = y;
    }
  }
  return data;
}
export function initTags(pages) {
  const data = {};
  for (let index = 0; index < pages.length; index++) {
    const element = pages[index];
    const tags = element.frontMatter.tags;
    tags.forEach((item) => {
      if (data[item]) {
        data[item].push(element);
      } else {
        data[item] = [];
        data[item].push(element);
      }
    });
  }
  return data;
}