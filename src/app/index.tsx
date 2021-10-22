/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';

import WidgetOrder from '@procraft/widget-order';
// import { getCatalogItemData } from '@procraft/widget-order/dist/helpers/getCatalogItemData';
import { AppProps } from './interfaces';

export const App: React.FC<AppProps> = ({
  // course_uid,
  // tariff_uid,
  // courses,
  ...other
}) => {
  // const items: WidgetOrderCourseItem[] = [];

  // const course = courses.find(n => n.uid === course_uid);

  // if (!course) {
  //   throw new Error('Не был получен курс');
  // }

  // const tariff = course?.tariffs?.find(n => n.uid === tariff_uid);

  // if (!tariff) {
  //   throw new Error('Не был получен тариф');
  // }

  // course.flows?.forEach(flow => {
  //   /**
  //    * Получаем каталогитем по потоку, курсу и тарифу
  //    */
  //   const catalogItem = course.catalogItems?.find(catalogItem => {
  //     return (
  //       catalogItem.course?.courseId === course.uid &&
  //       catalogItem.course.flowId === flow.uid &&
  //       catalogItem.course.tariffId === tariff.uid
  //     );
  //   });

  //   if (!catalogItem) {
  //     return null;
  //   }

  //   // const catalogItemData = getCatalogItemData(catalogItem, course, tariff, flow);
  //   const catalogItemData = getCatalogItemData(catalogItem, courses);

  //   if (!catalogItemData) {
  //     return null;
  //   }

  //   const { placesLeft } = catalogItemData;

  //   items.push({
  //     id: flow.id,
  //     uid: flow.uid,
  //     name: flow.name,
  //     price: catalogItem.unitPrice || 0,
  //     // @ts-ignore
  //     oldPrice: catalogItem.unitPriceOriginal || null,
  //     // @ts-ignore
  //     catalogItem,
  //     course: {
  //       flow,
  //       // @ts-ignore
  //       tariff,
  //     },
  //     placesLeft,
  //   });
  // });

  // if (items.length < 1) {
  //   throw new Error('Не был получен ни один элемент');
  // }

  return <WidgetOrder {...other} />;
};
