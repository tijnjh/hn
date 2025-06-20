import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/palettes/dark.system.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage.tsx";
import StoryPage from "./pages/StoryPage.tsx";

import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale.js";
import relativeTime from "dayjs/plugin/relativeTime.js";

const queryClient = new QueryClient();

setupIonicReact();

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "now",
    ss: "%ss",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/story/:id" component={StoryPage} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </QueryClientProvider>
  );
}
