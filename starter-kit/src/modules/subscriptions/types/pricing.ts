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

/**
 * DTO информации о текущей активной подписке организации
 */
export interface ActivePlanInfoDto {
  /**
   * Системное название тарифа
   */
  plan_code: string

  /**
   * Название тарифа
   */
  plan_title: string

  /**
   * Период: monthly, yearly или trial
   */
  billing_cycle: string

  /**
   * Дата окончания подписки (null для безлимитных)
   */
  ends_at: string | null
}

/**
 * Ответ API /billing/plans-info с информацией о тарифах и текущей подписке
 */
export interface BillingPlansInfoResponse {
  success: boolean
  code: number
  error: string | null
  message: string | null
  content: {
    items: PricingPlan[]
    current_subscription: ActivePlanInfoDto
  }
}
