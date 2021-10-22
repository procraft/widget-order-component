/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';

import OrderWidget from '@procraft/widget-order';

type CourseFragment = any;
type WidgetOrderCourseItem = any;
type WidgetOrderProps = any;

// TODO Пробросить массив курсов
const courses: CourseFragment[] = [];

let itemId = 1;

const getItem = (
  flowName: string,
  startsAt: Date,
  finishesAt: Date,
  price: number,
  oldPrice: number | null,
  placesLeft: number | null,
  tariffName: string,
  marketingBenefits: string[],
  sales: any = [],
): WidgetOrderCourseItem => ({
  price,
  oldPrice,
  name: 'Курс Мясо и Вино',
  id: '',
  uid: itemId++,
  course: {
    flow: {
      name: flowName,
      startsAt,
      finishesAt,
      uid: 1,
      id: 'flow1',
      colorStyle: 'lightgreen',
      kind: 'CONTINUOUS',
    },
    tariff: {
      __typename: 'CourseTariffPublicCustom',
      id: 'Q291cnNlVGFyaWZmUHVibGljOjU=',
      uid: 5,
      name: tariffName,
      courseId: 11,
      position: 2,
      isActive: true,
      flowBehaviour:
        itemId % 3 === 0
          ? 'CONTINUOUS'
          : itemId % 3 === 1
          ? 'MULTIPLE'
          : 'SINGLE',
      marketingBenefits,
      // flowDetails: [
      //   {
      //     __typename: 'CourseTariffPerFlowDetailsCustom',
      //     id: 'Q291cnNlVGFyaWZmRmxvdzpLZXkoNSwxNik=',
      //     courseTariffId: 5,
      //     flowId: 16,
      //     // capacity: {
      //     //   __typename: 'CourseTariffCapacity',
      //     //   value: 120,
      //     //   isDisplayRemainder: true,
      //     //   remainderDisplayKind: CourseTariffCapacityRemainderDisplayKind.REAL,
      //     //   remainderManualValue: null,
      //     // },
      //     priceDetails: {
      //       __typename: 'CourseTariffPriceDetails',
      //       kind: CourseTariffPriceKind.CHANGESBYTIME,
      //       changeByTime: {
      //         __typename: 'CourseTariffPriceDetailsChangeByTime',
      //         items: [
      //           {
      //             __typename: 'CourseTariffPriceDetailsChangeByTimeItem',
      //             priceMarketing: 69990,
      //             priceReal: 39990,
      //             startsAt: null,
      //             finishesAt: null,
      //           },
      //           {
      //             __typename: 'CourseTariffPriceDetailsChangeByTimeItem',
      //             priceMarketing: 89990,
      //             priceReal: 49990,
      //             startsAt: new Date(new Date().getTime() + 1000000000),
      //             finishesAt: null,
      //           },
      //         ],
      //       },
      //     },
      //   },
      // ],
    },
  },
  catalogItem: {
    id: `dsffew${itemId}`,
    uid: 1,
    name: 'Спроса много не бывает - СБ-VIP, СМБ-1',
    sales,
  },
  placesLeft,
});

const tariffName = 'СБ-Лайт';
const marketingBenefits = [
  '-МАТЕРИАЛЫ-',
  '9 модулей, 55 уроков (20 часов видео, 55 часов практики)',
  'Презентации по всем урокам',
  'Запись всех уроков бессрочно',
  '-ПРЕПОДАВАТЕЛИ-',
  'Альбина Халитова||#teacher1',
  'Ирина Царегородцева',
  'Ирина Чиркова',
  '-ПРАКТИКА-',
  'Практические задания на основе вашего бизнеса/продукта или учебного кейса, если продукта нет',
  'Проверка выполнения с онлайн обратной связью',
  'НЕТВОРКИНГ-',
  'Закрытая группа в ТГ для участников курса',
  'Закрытая группа в ТГ для слушателей пакетов Свой Бизнес всех потоков',
  '-SLA-',
  'Проверка по рабочим дням. Все задания сданные до 19-00 по мск проверяются в тот же день. Задания сданные после 19-00 мск обычно проверяются до 14-00 мск следующего дня во все дни кроме понедельников и послепраздничных дней',
  '-ИНФРАСТРУКТУРА-',
  '6 месяцев продукта ЗП от Прокрафт',
  '-ДЛИТЕЛЬНОСТЬ ПРАКТИКИ-',
  '6 недель',
];

const altItems = [
  getItem(
    'SD-1',
    new Date(),
    new Date(new Date().getTime() - 1000000000),
    49990,
    79990,
    null,
    tariffName,
    marketingBenefits,
  ),
  getItem(
    'SD-2',
    new Date(),
    new Date(new Date().getTime() - 1000000000),
    5990,
    null,
    0,
    tariffName,
    marketingBenefits,
  ),
  getItem(
    'SD-3',
    new Date(),
    new Date(new Date().getTime() - 1000000000),
    0,
    null,
    70,
    tariffName,
    marketingBenefits,
  ),
];

export const testCourseObject: WidgetOrderProps = {
  // item,
  items: altItems,
  orderLink: '/order',
  materialsLimit: 10,
  courses,
};

export function App() {
  return (
    <OrderWidget
      // courses={[]}
      // items={items}
      // materialsLimit={5}
      // orderLink="http://localhost:3002/"
      {...testCourseObject}
    />
  );
}
