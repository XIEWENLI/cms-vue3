import {
  Histogram,
  User,
  UserFilled,
  Folder,
  FolderOpened,
} from "@element-plus/icons-vue";

const components = [Histogram, User, UserFilled, Folder, FolderOpened];

const icon = (app) => {
  for (const component of components) {
    app.component(component.name, component);
  }
};

export default icon;
