import type { PartialDeep } from 'type-fest'
import type { Plugin } from 'vue'
import { layoutConfig } from '@crudui/components/templates/helpers/config'
import { useLayoutConfigStore } from '@crudui/components/templates/stores/config'
import type { LayoutConfig } from '@crudui/components/templates/helpers/types'
import { _setDirAttr } from '@crudui/components/templates/helpers/utils'

// 🔌 Plugin
export const createLayouts = (userConfig: PartialDeep<LayoutConfig>): Plugin => {
  return (): void => {
    const configStore = useLayoutConfigStore()

    // Non reactive Values
    layoutConfig.app.title = userConfig.app?.title ?? layoutConfig.app.title
    layoutConfig.app.logo = userConfig.app?.logo ?? layoutConfig.app.logo as any
    layoutConfig.app.overlayNavFromBreakpoint = userConfig.app?.overlayNavFromBreakpoint ?? layoutConfig.app.overlayNavFromBreakpoint
    layoutConfig.app.i18n.enable = userConfig.app?.i18n?.enable ?? layoutConfig.app.i18n.enable
    layoutConfig.app.iconRenderer = userConfig.app?.iconRenderer as LayoutConfig['app']['iconRenderer'] ?? layoutConfig.app.iconRenderer

    layoutConfig.verticalNav.defaultNavItemIconProps = userConfig.verticalNav?.defaultNavItemIconProps ?? layoutConfig.verticalNav.defaultNavItemIconProps

    layoutConfig.icons.chevronDown = userConfig.icons?.chevronDown ?? layoutConfig.icons.chevronDown
    layoutConfig.icons.chevronRight = userConfig.icons?.chevronRight ?? layoutConfig.icons.chevronRight
    layoutConfig.icons.close = userConfig.icons?.close ?? layoutConfig.icons.close
    layoutConfig.icons.verticalNavPinned = userConfig.icons?.verticalNavPinned ?? layoutConfig.icons.verticalNavPinned
    layoutConfig.icons.verticalNavUnPinned = userConfig.icons?.verticalNavUnPinned ?? layoutConfig.icons.verticalNavUnPinned
    layoutConfig.icons.sectionTitlePlaceholder = userConfig.icons?.sectionTitlePlaceholder ?? layoutConfig.icons.sectionTitlePlaceholder

    // Reactive Values (Store)
    configStore.$patch({
      appContentLayoutNav: userConfig.app?.contentLayoutNav ?? layoutConfig.app.contentLayoutNav,
      appContentWidth: userConfig.app?.contentWidth ?? layoutConfig.app.contentWidth,
      footerType: userConfig.footer?.type ?? layoutConfig.footer.type,
      navbarType: userConfig.navbar?.type ?? layoutConfig.navbar.type,
      isNavbarBlurEnabled: userConfig.navbar?.navbarBlur ?? layoutConfig.navbar.navbarBlur,
      isVerticalNavCollapsed: userConfig.verticalNav?.isVerticalNavCollapsed ?? layoutConfig.verticalNav.isVerticalNavCollapsed,

      // isAppRTL: userConfig.app?.isRTL ?? config.app.isRTL,
      // isLessThanOverlayNavBreakpoint: false,
      horizontalNavType: userConfig.horizontalNav?.type ?? layoutConfig.horizontalNav.type,
    })

    // _setDirAttr(config.app.isRTL ? 'rtl' : 'ltr')
    _setDirAttr(configStore.isAppRTL ? 'rtl' : 'ltr')
  }
}

export * from './components'
export { layoutConfig }
