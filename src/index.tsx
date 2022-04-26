/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FontFaceObserver from 'fontfaceobserver';

// Use consistent styling
// import 'sanitize.css/sanitize.css';

import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { CourseFragment } from '@procraft/widget-order/dist/interfaces/CourseFragment';

// Observe loading of Inter (to remove 'Inter', remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Inter', {});

// When Inter is loaded, add a font-family using Inter to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

// const MOUNT_NODE = document.getElementById('root');

// MOUNT_NODE &&
//   ReactDOM.render(
//     <ThemeProvider>
//       <HelmetProvider>
//         <React.StrictMode>
//           <App />
//         </React.StrictMode>
//       </HelmetProvider>
//     </ThemeProvider>,
//     MOUNT_NODE,
//   );

if (!customElements.get('widget-order')) {
  class WidgetOrderComponent extends HTMLElement {
    // constructor() {
    //   // Always call super first in constructor
    //   super();

    //   // write element functionality in here
    // }

    connectedCallback() {
      // this.innerHTML = `<h1>Hello world</h1>`;

      // setTimeout(() => {
      //   this.innerHTML = `<h2>Hello world!</h2>`;
      // }, 1000);

      const site_url = this.getAttribute('site_url');
      const ratesVisible = this.getAttribute('rates_visible');
      const course_uid = parseInt(this.getAttribute('course_uid') || '');
      // const tariff_uid = this.getAttribute('tariff_uid');
      const catalogItemUid = parseInt(
        this.getAttribute('catalog_item_uid') || '',
      );
      const materialsLimit = this.getAttribute('materials_limit') || '';

      if (!site_url) {
        throw new Error('Не указан параметр site_url');
      }

      if (!course_uid) {
        throw new Error('Не указан параметр course_uid');
      }

      // if (!tariff_uid) {
      //   throw new Error('Не указан параметр tariff_uid');
      // }

      if (!catalogItemUid) {
        throw new Error('Не указан параметр catalog_item_uid');
      }

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
            __typename
          }
          __typename
        }

        fragment OrderCatalogItemFr on OrderCatalogItem_Fragment {
          ...OrderCatalogItemFields
          master {
            id
            uid
            __typename
          }
          course {
            courseId
            flowId
            tariffId
            prolongationDays
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
            type
            __typename
          }
          __typename
        }

        fragment OrderItemPromoCode_ on PromoCode_Fragment {
          id
          code
          discountPercent
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

      /**
       * Делаем через задержку, так как реакт ругается на расхождение верстки
       * при вызове hydrate и тогда не отрисовывается компонент
       */
      setTimeout(() => {
        // const node = document.createElement('h2');

        // node.innerText = 'sdfsdfsdf';

        // this.appendChild(node);

        /**
         * Получаем текущие курсы
         */
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
