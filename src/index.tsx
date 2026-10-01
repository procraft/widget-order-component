import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import FontFaceObserver from 'fontfaceobserver';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { CourseFragment } from '@procraft/widget-order/dist/interfaces/CourseFragment';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { showSkeleton } from 'utils/skeleton';

const fragments = `
  fragment Course_ on CoursePublicCustom {
    id
    name
    uid
    kind
    subKind
    subKindLabel {
      valueNominative
      valueGenitive
      valueAccusative
      valueDative
      valueInstrumental
      valuePrepositional
      gender
      createdAt
    }
    tariffs {
      id
      uid
      name
      courseId
      position
      isActive
      flowBehaviour
      marketingBenefits
      __typename
    }
    catalogItems {
      ...OrderCatalogItemFr
      __typename
    }
    tariffPerFlowDataItems {
      courseId
      courseTariffId
      flowId
      priceDetails {
        kind
        changeByTime {
          items {
            priceMarketing
            priceReal
            startsAt
            finishesAt
            __typename
          }
          __typename
        }
        __typename
      }
      prolongation {
        items {
          price
          periodInDays
          __typename
        }
        __typename
      }
      marketingBenefitsComputed
      __typename
    }
    __typename
  }

  fragment OrderCatalogItemFr on OrderCatalogItem_Fragment {
    ...OrderCatalogItemFields
    master {
      id
      uid
      currency
      __typename
    }
    org {
      displayCurrencies {
        currency
        rate
        __typename
      }
      __typename
    }
    course {
      courseId
      flowId
      tariffId
      prolongationDays
      courseMeta {
        courseName
        courseKind
        courseSubKind
        courseSubKindLabel {
          valueNominative
          valueGenitive
          valueAccusative
          valueDative
          valueInstrumental
          valuePrepositional
          gender
          createdAt
        }
        webinarStartsAt
        webinarHasPassed
      }
      __typename
    }
    sales {
      ...sale
      __typename
    }
    reviewsCount
    reviews {
      edges {
        node {
          ...orderReview
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }

  fragment OrderCatalogItemFields on OrderCatalogItem_Fragment {
    id
    uid
    name
    title
    unitPrice
    unitPriceOriginal
    promoCode(code: $code) {
      ...OrderItemPromoCode_
      __typename
    }
    priceWithPromoCode(code: $code)
    course {
      courseId
      flowId
      tariffId
      __typename
    }
    fieldValues {
      uid
      fieldId
      fieldName
      optionName
      optionValue
      isSelected
      isDefault
      groupName
      extraPay
      extraPayOriginal
      extraPayPercentage
      extraWork
      extraWorkPercentage
      availableCount
      isDisplayRemainder
      parents
      type
      __typename
    }
    __typename
  }

  fragment OrderItemPromoCode_ on PromoCode_Fragment {
    id
    code
    value
    unit
    activeFrom
    activeTill
    isActive
    __typename
  }

  fragment sale on SaleCustom {
    ...saleFields
    benefitItems {
      ...OrderCatalogItemFields
      __typename
    }
    orderCondition {
      kind
      data {
        __typename
        ... on ItemOrderConditionData {
          shouldContainAll
          catalogItems {
            ...OrderCatalogItemFields
            sales {
              ...saleFields
              benefitItems {
                ...OrderCatalogItemFields
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        ... on PriceOrderConditionData {
          kind
          from
          to
        }
      }
      __typename
    }
    __typename
  }

  fragment saleFields on SaleCustom {
    id
    uid
    name
    isActive
    benefitKind
    benefitAmount
    benefitUnit
    __typename
  }

  fragment orderReview on OrderReviewCustom {
    id
    uid
    text
    meetExpectation
    reply
    rating
    timeCreated
    client
    __typename
  }
`;

const courseQuery = `
  query course($id: Int!, $code: String!) {
    course(id: $id, code: $code) {
      ...Course_
      __typename
    }
  }
  ${fragments}
`;

/** Весь каталог школы: прежний путь, остаётся запасным, если запрос одного курса не сработал */
const coursesQuery = `
  query courses($code: String!) {
    courses(code: $code) {
      ...Course_
      __typename
    }
  }
  ${fragments}
`;

const postQuery = (siteUrl: string, query: string, variables: object) =>
  fetch(`${siteUrl}/api/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  }).then(r => r.json());

const loadCourseFromCatalog = (siteUrl: string, courseUid: number) =>
  postQuery(siteUrl, coursesQuery, { code: '' }).then(response => {
    const courses: CourseFragment[] = response.data?.courses || [];

    if (!courses?.length) {
      throw new Error(`Не были получены данные для курса ${courseUid}`);
    }

    return courses.find(n => n.uid === courseUid);
  });

/**
 * Курс по uid одним запросом. Раньше виджет получал весь каталог школы и искал курс у себя:
 * у школы с сотнями курсов это секунды ответа и мегабайты JSON ради одной карточки.
 * Если сайт ответил ошибкой или не нашёл курс — прежний путь через весь каталог,
 * чтобы поведение и сообщения об ошибках не изменились.
 */
const loadCourse = (siteUrl: string, courseUid: number) =>
  postQuery(siteUrl, courseQuery, { id: courseUid, code: '' })
    .then(response => {
      const course: CourseFragment | null = response.data?.course ?? null;
      return !response.errors?.length && course?.uid === courseUid
        ? course
        : loadCourseFromCatalog(siteUrl, courseUid);
    })
    .catch(() => loadCourseFromCatalog(siteUrl, courseUid));

/** Несколько виджетов одного курса на странице делят один запрос */
const courseRequests = new Map<string, Promise<CourseFragment | undefined>>();

const getCourse = (siteUrl: string, courseUid: number) => {
  const key = `${siteUrl}|${courseUid}`;
  let request = courseRequests.get(key);
  if (!request) {
    request = loadCourse(siteUrl, courseUid);
    // Неудачный запрос не кешируем: следующий виджет попробует заново
    request.catch(() => courseRequests.delete(key));
    courseRequests.set(key, request);
  }
  return request;
};

const openSansObserver = new FontFaceObserver('Inter', {});

openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

if (!customElements.get('widget-order')) {
  class WidgetOrderComponent extends HTMLElement {
    connectedCallback() {
      const site_url = this.getAttribute('site_url');
      const ratesVisible = this.getAttribute('rates_visible');
      const course_uid = parseInt(this.getAttribute('course_uid') || '');
      const catalogItemUid = parseInt(
        this.getAttribute('catalog_item_uid') ?? '',
      );
      const materialsLimit = this.getAttribute('materials_limit') || '';

      const colors = {
        titleBg: this.getAttribute('title_bg'),
        titleText: this.getAttribute('title_text'),
        coloredText: this.getAttribute('colored_text'),
        contentBg: this.getAttribute('content_bg'),
        contentText: this.getAttribute('content_text'),
        extraBg: this.getAttribute('extra_bg'),
        mainBg: this.getAttribute('main_bg'),
      };

      if (!site_url) {
        throw new Error('Не указан параметр site_url');
      }

      if (!course_uid) {
        throw new Error('Не указан параметр course_uid');
      }

      if (!catalogItemUid) {
        throw new Error('Не указан параметр catalog_item_uid');
      }

      const hideSkeleton = showSkeleton(this, colors);

      /**
       * Делаем через задержку, так как реакт ругается на расхождение верстки
       * при вызове hydrate и тогда не отрисовывается компонент
       */
      setTimeout(() => {
        getCourse(site_url, course_uid).then(
          course => {
            // При ошибке место виджета остаётся пустым, как и до появления заглушки
            hideSkeleton();

            if (!course) {
              throw new Error(`Не был получен учебный курс ${course_uid}`);
            }

            const catalogItem = course.catalogItems?.find(
              n => n.uid === catalogItemUid,
            );

            if (!catalogItem) {
              throw new Error(
                `Не найден элемент каталога ${catalogItemUid} для курса ${course_uid}`,
              );
            }

            ReactDOM.render(
              <ThemeProvider>
                <HelmetProvider>
                  <React.StrictMode>
                    <App
                      orderLink={`${site_url}/order`}
                      course={course}
                      materialsLimit={parseInt(materialsLimit) || 10}
                      catalogItem={catalogItem}
                      ratesVisible={Boolean(ratesVisible)}
                      style={{
                        colors,
                      }}
                    />
                  </React.StrictMode>
                </HelmetProvider>
              </ThemeProvider>,
              this,
            );
          },
          error => {
            hideSkeleton();
            throw error;
          },
        );
      }, 100);
    }
  }

  customElements.define('widget-order', WidgetOrderComponent);
}
