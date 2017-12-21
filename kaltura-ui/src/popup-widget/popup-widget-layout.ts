export class PopupWidgetLayout {

  constructor() {}

  private static popupWidgetInitialZindex = 600;
  private static modalsCount = 0;

  static getPopupZindex(isFullScreen = false){
      if (isFullScreen){
          return 1000;
      }
      PopupWidgetLayout.popupWidgetInitialZindex += 2;
      return PopupWidgetLayout.popupWidgetInitialZindex;
  }

  static increaseModalCount(){
      PopupWidgetLayout.modalsCount++;
      if (PopupWidgetLayout.modalsCount === 1){
          document.body.classList.add("kModal");
      }
  }

  static decreaseModalCount(){
      PopupWidgetLayout.modalsCount--;
      if (PopupWidgetLayout.modalsCount === 0){
          document.body.classList.remove("kModal");
      }
      if (PopupWidgetLayout.modalsCount < 0){
          PopupWidgetLayout.modalsCount = 0;
      }
  }
}
