import WhiteRoseWedding from './WhiteRoseWedding';
import EntranceVideoWedding from './EntranceVideoWedding';

export const templateRegistry = {
  WhiteRoseWedding,
  EntranceVideoWedding,
};

export function getTemplateComponent(componentName) {
  return templateRegistry[componentName] || null;
}
