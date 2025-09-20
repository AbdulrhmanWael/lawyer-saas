import { useLocale } from "next-intl";

export default function LocaleIndex() {
  const locale = useLocale();

  return (
    <>
      <h1 className="text-red-500">Locale: {locale}</h1>
      <p>This is a test page for locale {locale}.</p>
    </>
  );
}
