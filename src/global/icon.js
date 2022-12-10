import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";

const components = [Document, IconMenu, Location, Setting];

const icon = (app) => {
  for (const component of components) {
    switch (component.name) {
      case "Menu":
        component.name = "IconMenu";
        break;
    }
    app.component(component.name, component);
  }
};

export default icon;
