

export default function LocaleIndex(props: { params: { locale: string } }) {
  const { locale } = props.params;

  return (
    <>
      <h1 className="text-red-500">Locale: {locale}</h1>
      <p>This is a test page for locale {locale}.</p>
    </>
  );
}
