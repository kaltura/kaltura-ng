export class PopupWidgetLayout {

  constructor() {}

  private static popupWidgetInitialZindex = 600;

  static getPopupZindex(){
      PopupWidgetLayout.popupWidgetInitialZindex += 2;
      return PopupWidgetLayout.popupWidgetInitialZindex;
  }
}
