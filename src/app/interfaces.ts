import { WidgetOrderProps } from '@procraft/widget-order';

export type AppProps = Omit<WidgetOrderProps, 'items'> & {
  course_uid: number;
  tariff_uid: number;
};
