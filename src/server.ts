import 'module-alias/register';
import { App } from '@/app';
import { AuthRoute, UserRoute } from '@/modules';
const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();
