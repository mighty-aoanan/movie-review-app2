/* eslint-disable testing-library/no-render-in-setup */
import { fireEvent, getByRole, render, screen, within } from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import { userList } from "../../utils/db.mocks"
import thunk from "redux-thunk";
import { createMemoryHistory } from "history";
import UserDashBoard from "../../pages/admin/UserDashBoard";
import {User} from '../../interfaces'
import userIcon from '../../images/user.png'


describe("<UserDashboard />", () => {
    const initialState = {
        users: userList
    }
    const mockStore = configureStore([thunk]);
    let store = mockStore(initialState);
    const renderApp = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <UserDashBoard />
                </BrowserRouter>
            </Provider>
        );
    };

    beforeEach(() => renderApp());

    test("renders the User Dashboard page with heading User List", () => {
        expect(screen.getByText("User List")).not.toBeNull();
    });

    


})