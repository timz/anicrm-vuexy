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
