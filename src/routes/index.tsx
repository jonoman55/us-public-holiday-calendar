import { lazy } from "react";
import { HashRouter as Router, Routes as Switch, Route } from "react-router-dom";

import Layout from "../components/Layout";

const HomePage = lazy(() => import("../pages/HomePage"));

const Routes = () => (
    <Router>
        <Layout>
            <Switch>
                <Route path="/" element={<HomePage />} />
            </Switch>
        </Layout>
    </Router>
);

export default Routes;
