export interface PricingPlan {
  id: number
  code: string
  title: string
  price_monthly: string
  price_annual: string
  visible: boolean
  info: {
    icon: string
    features: string[]
    highlight: boolean
    price_annual_month: number
    price_monthly_year: number
  }
  active: boolean
}

export interface FormattedPricingPlan {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  priceAnnualMonth: number
  priceMonthlyYear: number
  highlight: boolean
  active: boolean
  features: string[]
  code: string
}
