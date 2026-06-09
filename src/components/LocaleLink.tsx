"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useSite } from "@/lib/site-context";
import { localeHref } from "@/lib/locale";

/**
 * Drop-in <Link> that automatically prefixes internal hrefs with the active
 * locale (/th, /en, /zh). External links and #anchors pass through untouched.
 */
type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function LocaleLink({ href, ...props }: Props) {
  const { lang } = useSite();
  return <Link href={localeHref(href, lang)} {...props} />;
}
