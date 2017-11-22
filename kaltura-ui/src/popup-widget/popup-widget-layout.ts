export class PopupWidgetLayout {

  constructor() {}

  private static popupWidgetInitialZindex = 600;

  static getPopupZindex(isFullScreen = false){
      if (isFullScreen){
          return 1000;
      }
      PopupWidgetLayout.popupWidgetInitialZindex += 2;
      return PopupWidgetLayout.popupWidgetInitialZindex;
  }
}
