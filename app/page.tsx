// 根路径重定向到默认语言
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function RootPage() {
    redirect(`/${defaultLocale}`);
}