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
    action_backend: {
      link: string
      text: string
      style: string
    }
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
  isPopular: boolean
  current: boolean
  features: string[]
  code: string
  actionText: string
  actionStyle: string
}