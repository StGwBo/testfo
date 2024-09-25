import { checkboxes } from "../../constants/constants";
import { resetSelectedIds, removeSelectedId, getSelectedIds } from "../selectedIds/selectedIds";
import { updateCheckboxesStates, updateSelectedIds } from "../ui/ui";
import { toggleSelectedId, updateUrlParams } from "../utils/utils";
import { handleResetCheckboxes, handleCopyUrl, handleDeleteIds, handleCheckbox } from "./handlers";

jest.mock("../selectedIds/selectedIds", () => ({
    resetSelectedIds: jest.fn(),
    addSelectedId: jest.fn(),
    removeSelectedId: jest.fn(),
    getSelectedIds: jest.fn(),
}));

jest.mock("../ui/ui", () => ({
    updateCheckboxesStates: jest.fn(),
    updateSelectedIds: jest.fn(),
}));

jest.mock("../utils/utils", () => ({
    updateUrlParams: jest.fn(),
    toggleSelectedId: jest.fn(),
}));

describe("handlers functions", () => {
    let selectedIds;

    beforeEach(() => {
        selectedIds = document.querySelector(".checkbox-info__ids");

        global.navigator.clipboard = {
            writeText: jest.fn(),
        };

        getSelectedIds.mockClear();
        jest.clearAllMocks();
    });

    test("handleResetCheckboxes", () => {
        handleResetCheckboxes();

        expect(resetSelectedIds).toHaveBeenCalled();
        expect(updateSelectedIds).toHaveBeenCalledWith(selectedIds);
        expect(updateUrlParams).toHaveBeenCalled();
        expect(updateCheckboxesStates).toHaveBeenCalledWith(checkboxes());
    });

    test("handleCopyUrl", async () => {
        const url = "http://localhost/selectedIds=1,2,3";
        window.history.pushState({}, "", url);

        const currentUrl = window.location.href;

        handleCopyUrl();

        expect(currentUrl).toEqual(url);
    });

    test("handleDeleteIds", () => {
        const mockEvent = { target: { value: "1" } };

        handleDeleteIds(mockEvent);

        expect(removeSelectedId).toHaveBeenCalledWith("1");
        expect(updateSelectedIds).toHaveBeenCalledWith(selectedIds);
        expect(updateUrlParams).toHaveBeenCalled();
        expect(updateCheckboxesStates).toHaveBeenCalledWith(checkboxes());
    });

    test("handleCheckbox", () => {
        const mockAddEvent = { target: { value: "1", checked: true } };
        const mockRemoveEvent = { target: { value: "1", checked: false } };
        const checkbox = mockAddEvent.target;
        const id = checkbox.value;

        handleCheckbox(mockAddEvent);
        expect(toggleSelectedId).toHaveBeenCalledWith(checkbox, id);
        expect(updateSelectedIds).toHaveBeenCalledWith(selectedIds);
        expect(updateUrlParams).toHaveBeenCalled();

        handleCheckbox(mockRemoveEvent);
        expect(toggleSelectedId).toHaveBeenCalledWith(checkbox, id);
        expect(updateSelectedIds).toHaveBeenCalledWith(selectedIds);
        expect(updateUrlParams).toHaveBeenCalled();
    });
});
