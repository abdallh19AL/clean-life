import { dopamineArticle } from './dopamine';
import { smokingArticle } from './smoking';
import { identityArticle } from './identity';
import { screensArticle } from './screens';
import { passionArticle } from './passion';
import { environmentArticle } from './environment';
import { habitsArticle } from './habits';
import { relapseArticle } from './relapse'; // استيراد مقالة الانتكاسة

export const articlesDB = {
  "dopamine": dopamineArticle,
  "smoking": smokingArticle,
  "identity": identityArticle,
  "screens": screensArticle,
  "passion": passionArticle,
  "environment": environmentArticle,
  "habits": habitsArticle,
  "relapse": relapseArticle, // الربط النهائي
};