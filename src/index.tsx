import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import FontFaceObserver from 'fontfaceobserver';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { CourseFragment } from '@procraft/widget-order/dist/interfaces/CourseFragment';
import { ThemeProvider } from 'styles/theme/ThemeProvider';

const query = `
  query courses($code: String!) {
    courses(code: $code) {
      ...Course_
      __typename
    }
  }

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
    rating
    timeCreated
    client
    __typename
  }
`;

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

      /**
       * Делаем через задержку, так как реакт ругается на расхождение верстки
       * при вызове hydrate и тогда не отрисовывается компонент
       */
      setTimeout(() => {
        fetch(`${site_url}/api/`, {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            query,
            variables: {
              code: '',
            },
          }),
        }).then(async r => {
          const response = await r.json();

          const courses: CourseFragment[] = response.data?.courses || [];

          if (!courses?.length) {
            throw new Error('Не были получены данные');
          }

          const course = courses.find(n => n.uid === course_uid);

          if (!course) {
            throw new Error('Не был получен учебный курс');
          }

          const catalogItem = course.catalogItems?.find(
            n => n.uid === catalogItemUid,
          );

          if (!catalogItem) {
            throw new Error('Не был получен элемент каталога');
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
        });
      }, 100);
    }
  }

  customElements.define('widget-order', WidgetOrderComponent);
}
