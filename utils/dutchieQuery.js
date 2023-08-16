import { gql } from "graphql-request";

export function fetchAllRetailers() {
  const query = gql`
    fragment addressFragment on AddressObject {
      line1
      line2
      city
      postalCode
      state
      country
    }

    fragment bannerColorsFragment on BannerColorConfiguration {
      background
      border
      color
      id
    }

    fragment deliverySettingsFragment on DeliverySettings {
      afterHoursOrderingForDelivery
      afterHoursOrderingForPickup
      deliveryArea
      deliveryFee
      deliveryMinimum
      disablePurchaseLimits
      limitPerCustomer
      pickupMinimum
      scheduledOrderingForDelivery
      scheduledOrderingForPickup
    }

    fragment hoursDayFragment on HoursDay {
      active
      start
      end
    }

    fragment hoursFragment on Hours {
      Sunday {
        ...hoursDayFragment
      }
      Monday {
        ...hoursDayFragment
      }
      Tuesday {
        ...hoursDayFragment
      }
      Wednesday {
        ...hoursDayFragment
      }
      Thursday {
        ...hoursDayFragment
      }
      Friday {
        ...hoursDayFragment
      }
      Saturday {
        ...hoursDayFragment
      }
    }

    fragment retailerFragment on Retailer {
      address
      addressObject {
        ...addressFragment
      }
      banner {
        colors {
          ...bannerColorsFragment
        }
        html
      }
      coordinates {
        latitude
        longitude
      }
      deliverySettings {
        ...deliverySettingsFragment
      }

      fulfillmentOptions {
        curbsidePickup
        delivery
        driveThruPickup
        pickup
      }
      hours {
        delivery {
          ...hoursFragment
        }
        pickup {
          ...hoursFragment
        }
        regular {
          ...hoursFragment
        }
        curbsidePickup {
          ...hoursFragment
        }
        specialHours {
          startDate
          endDate
          specialOperatingHours {
            date
            curbsidePickup {
              ...hoursDayFragment
            }
            delivery {
              ...hoursDayFragment
            }
            driveThruPickup {
              ...hoursDayFragment
            }
            pickup {
              ...hoursDayFragment
            }
          }
          name
      }
      }
      id
      menuTypes
      name
      paymentMethodsByOrderTypes {
        orderType
        paymentMethods
      }
      settings {
        menuWeights
      }
    }

    # Return retailer data for all stores
    query RetailersQuery {
      retailers {
        ...retailerFragment
      }
    }
  `;
  return query;
}

export function nearByRetailers() {
  const query = gql`
    fragment addressFragment on AddressObject {
      line1
      line2
      city
      postalCode
      state
      country
    }

    fragment bannerColorsFragment on BannerColorConfiguration {
      background
      border
      color
      id
    }

    fragment deliverySettingsFragment on DeliverySettings {
      afterHoursOrderingForDelivery
      afterHoursOrderingForPickup
      deliveryArea
      deliveryFee
      deliveryMinimum
      disablePurchaseLimits
      limitPerCustomer
      pickupMinimum
      scheduledOrderingForDelivery
      scheduledOrderingForPickup
    }

    fragment hoursDayFragment on HoursDay {
      active
      start
      end
    }

    fragment hoursFragment on Hours {
      Sunday {
        ...hoursDayFragment
      }
      Monday {
        ...hoursDayFragment
      }
      Tuesday {
        ...hoursDayFragment
      }
      Wednesday {
        ...hoursDayFragment
      }
      Thursday {
        ...hoursDayFragment
      }
      Friday {
        ...hoursDayFragment
      }
      Saturday {
        ...hoursDayFragment
      }
    }

    fragment retailerFragment on Retailer {
      address
      addressObject {
        ...addressFragment
      }
      banner {
        colors {
          ...bannerColorsFragment
        }
        html
      }
      coordinates {
        latitude
        longitude
      }
      deliverySettings {
        ...deliverySettingsFragment
      }

      fulfillmentOptions {
        curbsidePickup
        delivery
        driveThruPickup
        pickup
      }
      hours {
        delivery {
          ...hoursFragment
        }
        pickup {
          ...hoursFragment
        }
        regular {
          ...hoursFragment
        }
        curbsidePickup {
          ...hoursFragment
        }
        specialHours {
          startDate
          endDate
          specialOperatingHours {
            date
            curbsidePickup {
              ...hoursDayFragment
            }
            delivery {
              ...hoursDayFragment
            }
            driveThruPickup {
              ...hoursDayFragment
            }
            pickup {
              ...hoursDayFragment
            }
          }
          name
      }
      }
      id
      menuTypes
      name
      paymentMethodsByOrderTypes {
        orderType
        paymentMethods
      }
      settings {
        menuWeights
      }
    }

    query RetailersNearLocation(
      $userLatitude: Float!
      $userLongitude: Float!
      $maxDistance: Float!
    ) {
      retailersNearLocation(
        location: {
          coordinates: { latitude: $userLatitude, longitude: $userLongitude }
          maxDistance: $maxDistance
          unit: MI
        }
      ) {
        retailer {
          ...retailerFragment
        }
        locationDetail {
          distance
          unit
          maxDistance
          validForDelivery
        }
      }
    }
  `;
  return query;
}

export function fetchOneRetailer() {
  const query = gql`
    fragment addressFragment on AddressObject {
      line1
      line2
      city
      postalCode
      state
      country
    }

    fragment bannerColorsFragment on BannerColorConfiguration {
      background
      border
      color
      id
    }

    fragment deliverySettingsFragment on DeliverySettings {
      afterHoursOrderingForDelivery
      afterHoursOrderingForPickup
      deliveryArea
      deliveryFee
      deliveryMinimum
      disablePurchaseLimits
      limitPerCustomer
      pickupMinimum
      scheduledOrderingForDelivery
      scheduledOrderingForPickup
    }

    fragment hoursDayFragment on HoursDay {
      active
      start
      end
    }

    fragment hoursFragment on Hours {
      Sunday {
        ...hoursDayFragment
      }
      Monday {
        ...hoursDayFragment
      }
      Tuesday {
        ...hoursDayFragment
      }
      Wednesday {
        ...hoursDayFragment
      }
      Thursday {
        ...hoursDayFragment
      }
      Friday {
        ...hoursDayFragment
      }
      Saturday {
        ...hoursDayFragment
      }
    }

    fragment retailerFragment on Retailer {
      address
      addressObject {
        ...addressFragment
      }
      banner {
        colors {
          ...bannerColorsFragment
        }
        html
      }
      coordinates {
        latitude
        longitude
      }
      deliverySettings {
        ...deliverySettingsFragment
      }

      fulfillmentOptions {
        curbsidePickup
        delivery
        driveThruPickup
        pickup
      }
      hours {
        delivery {
          ...hoursFragment
        }
        pickup {
          ...hoursFragment
        }
        regular {
          ...hoursFragment
        }
        curbsidePickup {
          ...hoursFragment
        }
        specialHours {
          startDate
          endDate
          specialOperatingHours {
            date
            curbsidePickup {
              ...hoursDayFragment
            }
            delivery {
              ...hoursDayFragment
            }
            driveThruPickup {
              ...hoursDayFragment
            }
            pickup {
              ...hoursDayFragment
            }
          }
          name
      }
      }
      id
      menuTypes
      name
      paymentMethodsByOrderTypes {
        orderType
        paymentMethods
      }
      settings {
        menuWeights
      }
    }

    # Return retailer data for one store
    query RetailerQuery($retailerId: ID!) {
      retailer(id: $retailerId) {
        ...retailerFragment
      }
    }
  `;
  return query;
}

export function fetchMultipleCustomer() {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment orderFragment on Order {
      createdAt
      customerId
      delivery
      dispensaryName
      foreignId
      id
      items {
        option
        price
        product {
          ...productFragment
        }
        productId
        quantity
        subtotal
      }
      medical
      metadata
      orderNumber
      pickup
      recreational
      reservationDate {
        startTime
        endTime
      }
      status
      subtotal
      tax
      total
    }

    fragment customerFragment on Customer {
      birthdate
      email
      guest
      id
      medicalCard {
        expirationDate
        number
        photo
        state
      }
      name
      optIns {
        marketing
        orderStatus
        specials
      }
      orders {
        ...orderFragment
      }
      phone
    }

    query SortedCustomers($retailerId: ID!) {
      customers(retailerId: $retailerId, sort: { direction: ASC, key: NAME }) {
        ...customerFragment
      }
    }
  `;
  return query;
}

export function fetchOneCustomer() {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment orderFragment on Order {
      createdAt
      customerId
      delivery
      dispensaryName
      foreignId
      id
      items {
        option
        price
        product {
          ...productFragment
        }
        productId
        quantity
        subtotal
      }
      medical
      metadata
      orderNumber
      pickup
      recreational
      reservationDate {
        startTime
        endTime
      }
      status
      subtotal
      tax
      total
    }

    fragment customerFragment on Customer {
      birthdate
      email
      guest
      id
      medicalCard {
        expirationDate
        number
        photo
        state
      }
      name
      optIns {
        marketing
        orderStatus
        specials
      }
      orders {
        ...orderFragment
      }
      phone
    }

    query CustomerQuery($retailerId: ID!, $customerId: ID!) {
      customer(retailerId: $retailerId, id: $customerId) {
        ...customerFragment
      }
    }
  `;
  return query;
}

export function fetchAllProduct() {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    query MenuQuery($retailerId: ID!) {
      menu(retailerId: $retailerId) {
        weights
        brands {
          description
          id
          imageUrl
          name
        }
        productsCount
        products {
          ...productFragment
        }
      }
    }
  `;
  return query;
}

export function fetchOneProduct() {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    query ProductQuery($retailerId: ID!, $productId: ID!) {
      product(retailerId: $retailerId, id: $productId) {
        ...productFragment
      }
    }
  `;
  return query;
}

export function fetchAllProductCategory() {
  const query = gql`
    query MenuByCategory($retailerId: ID!) {
      menu(retailerId: $retailerId) {
        products {
          category
        }
      }
    }
  `;
  return query;
}

export function fetchAllProductStrainType() {
  const query = gql`
    query MenuByCategory($retailerId: ID!) {
      menu(retailerId: $retailerId) {
        products {
          strainType
        }
      }
    }
  `;
  return query;
}

export function fetchAllProductEffects() {
  const query = gql`
    query MenuByCategory($retailerId: ID!) {
      menu(retailerId: $retailerId) {
        products {
          effects
        }
      }
    }
  `;
  return query;
}

export function fetchAllProductSubCategory(retailerId) {
  const query = gql`
    query FetchAllProductSubCategory($retailerId: String!) {
      menu(retailerId: $retailerId) {
        products {
          subcategory
        }
      }
    }
  `;

  return query;
}

export const fetchAllProductBrand = () => {
  const query = gql`
    fragment brandFragment on Brand {
      description
      id
      imageUrl
      name
    }

    query BrandsQuery($retailerId: ID!) {
      menu(retailerId: $retailerId) {
        brands {
          ...brandFragment
        }
      }
    }
  `;

  return query;
};

export const addItemToCheckout = () => {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment checkoutAdressFragment on CheckoutAddress {
      city
      deliverable
      formatted
      geometry {
        coordinates
        type
      }
      state
      street1
      street2
      valid
      zip
    }

    fragment itemFragment on Item {
      id
      errors
      option
      product {
        ...productFragment
      }
      productId
      quantity
      valid
      isDiscounted
      basePrice
      discounts {
        total
      }
      taxes {
        total
        cannabis
        sales
      }
    }

    fragment priceSummaryFragment on PriceSummary {
      discounts
      fees
      mixAndMatch
      rewards
      subtotal
      taxes
      total
    }

    fragment checkoutFragment on Checkout {
      address {
        ...checkoutAdressFragment
      }
      createdAt
      id
      items {
        ...itemFragment
      }
      orderType
      priceSummary {
        ...priceSummaryFragment
      }
      pricingType
      redirectUrl
      updatedAt
    }

    mutation AddItemToCheckout(
      $retailerId: ID!
      $checkoutId: ID!
      $productId: ID!
      $quantity: Int!
      $option: String!
    ) {
      addItem(
        retailerId: $retailerId
        checkoutId: $checkoutId
        productId: $productId
        quantity: $quantity
        option: $option
      ) {
        ...checkoutFragment
      }
    }
  `;

  return query;
};

export function createCheckout() {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment checkoutAdressFragment on CheckoutAddress {
      city
      deliverable
      formatted
      geometry {
        coordinates
        type
      }
      state
      street1
      street2
      valid
      zip
    }

    fragment itemFragment on Item {
      id
      errors
      option
      product {
        ...productFragment
      }
      productId
      quantity
      valid
      isDiscounted
      basePrice
      discounts {
        total
      }
      taxes {
        total
        cannabis
        sales
      }
    }

    fragment priceSummaryFragment on PriceSummary {
      discounts
      fees
      mixAndMatch
      rewards
      subtotal
      taxes
      total
    }

    fragment checkoutFragment on Checkout {
      address {
        ...checkoutAdressFragment
      }
      createdAt
      id
      items {
        ...itemFragment
      }
      orderType
      priceSummary {
        ...priceSummaryFragment
      }
      pricingType
      redirectUrl
      updatedAt
    }

    mutation CreateCheckout(
      $retailerId: ID!
      $address: CheckoutAddressInput
      $orderType: OrderType!
      $pricingType: PricingType!
      $metadata: JSON
    ) {
      createCheckout(
        retailerId: $retailerId
        address: $address
        orderType: $orderType
        pricingType: $pricingType
        metadata: $metadata
      ) {
        ...checkoutFragment
      }
    }
  `;
  return query;
}

export function filterProducts() {
  const query = `
  fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
  }
    
  fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
          ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
  }
    
  fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
          description
          id
          name
      }
      unit 
      value
  }
    
  fragment productFragment on Product {
      brand {
          description
          id
          imageUrl
          name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
          id
          url
          label
          description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
          formatted
          range
          unit
      }
      potencyThc {
          formatted
          range
          unit
      }
      posMetaData {
          id
          category
          sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
          id
          option
          priceMed
          priceRec
          specialPriceMed
          specialPriceRec
          quantity
      }
      terpenes {
          ...activeTerpeneFragment
      }
      cannabinoids {
          ...activeCannabinoidFragment
      }
  }
    
  query FilterProducts(
      $retailerId: ID!
      $filter: MenuFilter,
      $menuType: MenuType,
      $pagination: Pagination,
      $sort: MenuSort
    ) {
      menu(
        retailerId: $retailerId
        filter: $filter,
        menuType: $menuType,
        pagination: $pagination,
        sort: $sort
      ) {
        weights
        brands {
          description
          id
          imageUrl
          name
        }
        productsCount
        products {
          ...productFragment
        }
      }
  }
  `;
  return query;
}

export const fetchAllSpecials = gql`
  fragment specialFragment on Special {
    id
    name
    type
    redemptionLimit
    menuType
    emailConfiguration {
      description
      descriptionHtml
      subject
      heading
      enabled
    }
    scheduleConfiguration {
      startStamp
      endStamp
      days
      setEndDate
      endDate
      recurringStartTime
      recurringEndTime
    }
    menuDisplayConfiguration {
      name
      description
      image
    }
  }

  query GetSpecialsList($retailerId: ID!) {
    specials(retailerId: $retailerId) {
      ...specialFragment
    }
  }
`;

export const menuType = () => {
  const query = gql`
    query MenuTypesQuery($id: ID!) {
      retailer(id: $id) {
        menuTypes
      }
    }
  `;

  return query;
};

export const removeItemFromCheckout = () => {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment checkoutAdressFragment on CheckoutAddress {
      city
      deliverable
      formatted
      geometry {
        coordinates
        type
      }
      state
      street1
      street2
      valid
      zip
    }

    fragment itemFragment on Item {
      id
      errors
      option
      product {
        ...productFragment
      }
      productId
      quantity
      valid
      isDiscounted
      basePrice
      discounts {
        total
      }
      taxes {
        total
        cannabis
        sales
      }
    }

    fragment priceSummaryFragment on PriceSummary {
      discounts
      fees
      mixAndMatch
      rewards
      subtotal
      taxes
      total
    }

    fragment checkoutFragment on Checkout {
      address {
        ...checkoutAdressFragment
      }
      createdAt
      id
      items {
        ...itemFragment
      }
      orderType
      priceSummary {
        ...priceSummaryFragment
      }
      pricingType
      redirectUrl
      updatedAt
    }

    mutation RemoveItemFromCheckout(
      $retailerId: ID!
      $checkoutId: ID!
      $itemId: ID!
    ) {
      removeItem(
        retailerId: $retailerId
        checkoutId: $checkoutId
        itemId: $itemId
      ) {
        ...checkoutFragment
      }
    }
  `;

  return query;
};

export const updateQuantity = () => {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment checkoutAdressFragment on CheckoutAddress {
      city
      deliverable
      formatted
      geometry {
        coordinates
        type
      }
      state
      street1
      street2
      valid
      zip
    }

    fragment itemFragment on Item {
      id
      errors
      option
      product {
        ...productFragment
      }
      productId
      quantity
      valid
      isDiscounted
      basePrice
      discounts {
        total
      }
      taxes {
        total
        cannabis
        sales
      }
    }

    fragment priceSummaryFragment on PriceSummary {
      discounts
      fees
      mixAndMatch
      rewards
      subtotal
      taxes
      total
    }

    fragment checkoutFragment on Checkout {
      address {
        ...checkoutAdressFragment
      }
      createdAt
      id
      items {
        ...itemFragment
      }
      orderType
      priceSummary {
        ...priceSummaryFragment
      }
      pricingType
      redirectUrl
      updatedAt
    }

    mutation UpdateQuantity(
      $retailerId: ID!
      $checkoutId: ID!
      $itemId: ID!
      $quantity: Int!
    ) {
      updateQuantity(
        retailerId: $retailerId
        checkoutId: $checkoutId
        itemId: $itemId
        quantity: $quantity
      ) {
        ...checkoutFragment
      }
    }
  `;

  return query;
};

export const fetchOneOrder = () => {
  const query = gql`
  # Create a productFragment, which is needed to build the orderFragment
  fragment terpeneFragment on Terpene {
    aliasList
    aromas
    description
    effects
    id
    name
    potentialHealthBenefits
    unitSymbol
  }
  
  fragment activeTerpeneFragment on ActiveTerpene {
    id
    terpene {
      ...terpeneFragment
    }
    name
    terpeneId
    unit
    unitSymbol
    value
  }
  
  fragment activeCannabinoidFragment on ActiveCannabinoid {
    cannabinoidId
    cannabinoid {
      description
      id
      name
    }
    unit 
    value
  }
  
  fragment productFragment on Product {
    brand {
      description
      id
      imageUrl
      name
    }
    category
    description
    descriptionHtml
    effects
    enterpriseProductId
    id
    productBatchId
    image
    images {
      id
      url
      label
      description
    }
    menuTypes
    name
    slug
    posId
    potencyCbd {
      formatted
      range
      unit
    }
    potencyThc {
      formatted
      range
      unit
    }
    posMetaData {
      id
      category
      sku
    }
    staffPick
    strainType
    subcategory
    tags
    variants {
      id
      option
      priceMed
      priceRec
      specialPriceMed
      specialPriceRec
      quantity
    }
    terpenes {
      ...activeTerpeneFragment
    }
    cannabinoids {
      ...activeCannabinoidFragment
    }
  }
  
  fragment customerFragment on Customer {
    birthdate
    email
    guest
    id
    medicalCard {
      expirationDate
      number
      photo
      state
    }
    name
    optIns {
      marketing
      orderStatus
      specials
    }
    phone
  }
  
  fragment orderFragment on Order {
    createdAt
    customer {
      ...customerFragment
    }
    customerId
    delivery
    dispensaryName
    foreignId
    id
    items {
      option
      price
      product {
        ...productFragment
      }
      productId
      quantity
      subtotal
    }
    medical
    metadata
    orderNumber
    paymentMethod
    pickup
    recreational
    reservationDate {
      startTime
      endTime
    }
    status
    subtotal
    tax
    total
  }
  
  # Return data on a single order
  query OrderQuery(
    $retailerId: ID!
    $orderId: ID!
  ) {
    order(
      retailerId: $retailerId
      id: $orderId
    ) {
      ...orderFragment
    }
  }
  `;

  return query;
};

export const fetchMultipleOrder = () => {
  const query = gql`
    # Create a productFragment, which is needed to build the orderFragment
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment customerFragment on Customer {
      birthdate
      email
      guest
      id
      medicalCard {
        expirationDate
        number
        photo
        state
      }
      name
      optIns {
        marketing
        orderStatus
        specials
      }
      phone
    }

    fragment orderFragment on Order {
      createdAt
      customer {
        ...customerFragment
      }
      customerId
      delivery
      dispensaryName
      foreignId
      id
      items {
        option
        price
        product {
          ...productFragment
        }
        productId
        quantity
        subtotal
      }
      medical
      metadata
      orderNumber
      pickup
      recreational
      reservationDate {
        startTime
        endTime
      }
      status
      subtotal
      tax
      total
    }

    # Fetch multiple orders with pagination
    query PaginatedOrders($retailerId: ID!) {
      orders(pagination: { offset: 0, limit: 50 }, sort: { direction: DESC, key: CREATED_AT }, retailerId: $retailerId) {
        ...orderFragment
      }
    }
  `;

  return query;
};

export const fetchCartDetails = () => {
  const query = gql`
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment checkoutAdressFragment on CheckoutAddress {
      city
      deliverable
      formatted
      geometry {
        coordinates
        type
      }
      state
      street1
      street2
      valid
      zip
    }

    fragment itemFragment on Item {
      id
      errors
      option
      product {
        ...productFragment
      }
      productId
      quantity
      valid
      isDiscounted
      basePrice
      discounts {
        total
      }
      taxes {
        total
        cannabis
        sales
      }
    }

    fragment priceSummaryFragment on PriceSummary {
      discounts
      fees
      mixAndMatch
      rewards
      subtotal
      taxes
      total
    }

    fragment checkoutFragment on Checkout {
      address {
        ...checkoutAdressFragment
      }
      createdAt
      id
      items {
        ...itemFragment
      }
      orderType
      priceSummary {
        ...priceSummaryFragment
      }
      pricingType
      redirectUrl
      updatedAt
    }

    query FetchCartDetails($retailerId: ID!, $checkoutId: ID!) {
      checkout(retailerId: $retailerId, id: $checkoutId) {
        ...checkoutFragment
      }
    }
  `;

  return query;
};

export const filterListQuery = () => {
  const query = gql`
    query MenuByCategory($retailerId: ID!) {
      menu(retailerId: $retailerId) {
        products {
          category
          strainType
          effects
        }
      }
    }
  `;
  return query;
};

export const fetchProductsCount = () => {
  const query = gql`
    query MenuQuery($retailerId: ID!) {
      menu(retailerId: $retailerId) {
        productsCount
      }
    }
  `;
  return query;
};

export const fetchAllProductsForScheduler = () => {
  const query = gql`
    fragment productFragment on Product {
      brand {
        id
        name
      }
      image
      id
      name
      slug
      category
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
    }

    query FilterProducts($retailerId: ID!, $pagination: Pagination) {
      menu(retailerId: $retailerId, pagination: $pagination) {
        products {
          ...productFragment
        }
      }
    }
  `;
  return query;
};

export const fetchMOWithOrderNumber = () => {
  const query = gql`
    # Create a productFragment, which is needed to build the orderFragment
    fragment terpeneFragment on Terpene {
      aliasList
      aromas
      description
      effects
      id
      name
      potentialHealthBenefits
      unitSymbol
    }

    fragment activeTerpeneFragment on ActiveTerpene {
      id
      terpene {
        ...terpeneFragment
      }
      name
      terpeneId
      unit
      unitSymbol
      value
    }

    fragment activeCannabinoidFragment on ActiveCannabinoid {
      cannabinoidId
      cannabinoid {
        description
        id
        name
      }
      unit
      value
    }

    fragment productFragment on Product {
      brand {
        description
        id
        imageUrl
        name
      }
      category
      description
      descriptionHtml
      effects
      enterpriseProductId
      id
      productBatchId
      image
      images {
        id
        url
        label
        description
      }
      menuTypes
      name
      slug
      posId
      potencyCbd {
        formatted
        range
        unit
      }
      potencyThc {
        formatted
        range
        unit
      }
      posMetaData {
        id
        category
        sku
      }
      staffPick
      strainType
      subcategory
      tags
      variants {
        id
        option
        priceMed
        priceRec
        specialPriceMed
        specialPriceRec
        quantity
      }
      terpenes {
        ...activeTerpeneFragment
      }
      cannabinoids {
        ...activeCannabinoidFragment
      }
    }

    fragment customerFragment on Customer {
      birthdate
      email
      guest
      id
      medicalCard {
        expirationDate
        number
        photo
        state
      }
      name
      optIns {
        marketing
        orderStatus
        specials
      }
      phone
    }

    fragment orderFragment on Order {
      createdAt
      customer {
        ...customerFragment
      }
      customerId
      delivery
      dispensaryName
      foreignId
      id
      items {
        option
        price
        product {
          ...productFragment
        }
        productId
        quantity
        subtotal
      }
      medical
      metadata
      orderNumber
      pickup
      recreational
      reservationDate {
        startTime
        endTime
      }
      status
      subtotal
      tax
      total
    }

    # Fetch multiple orders with an orderNumber filter
    query OrdersByOrderNumber($retailerId: ID!, $filter: OrdersFilter) {
      orders(filter: $filter, retailerId: $retailerId) {
        ...orderFragment
      }
    }
  `;
  return query;
};
