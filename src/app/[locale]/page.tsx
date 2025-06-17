import { locales } from "@/i18n/config"
import HomePageWrapper from "@/components/home-page-wrapper"

// Генерируем статические параметры для всех поддерживаемых локалей
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocalizedHomePage(props: {
		params: { locale: string }
	}) {
		// Await params before using them
		const paramsData = await Promise.resolve(props.params);
		const { locale } = paramsData;
		// Cast locale to valid union type
		const typedLocale = locale as "en" | "ru" | "uk";

		// Проверяем, является ли локаль допустимой
		if (!locales.includes(typedLocale)) {
			return null; // Будет обработано middleware
		}

		return <HomePageWrapper initialLocale={typedLocale} />
	}
