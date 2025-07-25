import { colorEnum } from "./colorDefine";

const ALL = "ALL";
const OCCUPIED = "OCCUPIED";
const AVAILABLE = "AVAILABLE";
const UNAVAILABLE = "UNAVAILABLE";
const UNAVAILABLETODAY = "UNAVAILABLETODAY";
const PENDING = "PENDING";
const ACCEPTED = "ACCEPTED";
const DONE = "DONE";
const REJECTED = "REJECTED";
const CANCELLED = "CANCELLED";
const FAILED = "FAILED";
const HIDE = "HIDE";

const payTypeEnum = {
    NORMAL: "Normal checkout",
    SPLIT: "Split to 2 bill",
    MERGE: "Merge with other table"
};

const viewModeEnum = {
    TABLEMODE: "Table Mode",
    CARDMODE: "Card Mode"
}

const statusEnum = {
    NOTORDER: "NOTORDER",
    OCCUPIED: "OCCUPIED",
    AVAILABLE: "AVAILABLE",
    UNAVAILABLE: "UNAVAILABLE",
    UNAVAILABLETODAY: "UNAVAILABLETODAY",
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    DONE: "DONE",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
    FAILED: "FAILED",
    HIDE: "HIDE",
    FINISHED: "FINISHED"
}

const allColorEnum = {
    NOTORDER: colorEnum.blue,
    OCCUPIED: colorEnum.blue,
    AVAILABLE: colorEnum.cyan,
    UNAVAILABLE: colorEnum.gray_200,
    UNAVAILABLETODAY: colorEnum.gray_400,
    PENDING: colorEnum.yellow,
    ACCEPTED: colorEnum.purple,
    DONE: colorEnum.teal,
    REJECTED: colorEnum.yellow,
    CANCELLED: colorEnum.black,
    FAILED: colorEnum.red,
    HIDE: colorEnum.white,
    FINISHED: colorEnum.green,
    bgHead: colorEnum.gray_400,
    bgBody: colorEnum.gray_300
}

const viewNameEnum = {
    LISTDATA: "ListData",
    ADDZONE: "AddZone",
    EDITZONE: "EditZone",
    CLONEZONE: "CloneZone",
    ADDTABLE: "AddTable",
    EDITTABLE: "EditTable",
    CLONETABLE: "CloneTable",
    ADDCATEGORY: "AddCategory",
    EDITCATEGORY: "EditCategory",
    CLONECATEGORY: "CloneCategory",
    ADDITEM: "AddItem",
    EDITITEM: "EditItem",
    CLONEITEM: "CloneItem",
    CREATEORDER: "CreateOrder",
    CREATEBILL: "CreateBill",
    MERGEBILL: "MergeBill",
    BILLINFO: "BillInfo",
    MERGE: "Merge",
    SPLIT: "Split",
    REVIEW: "Review",
    CONFIRM: "Confirm"
}

const currencyEnum = {
    ERO: {
        label: "ERO",
        value: "€"
    },
    USD: {
        label: "USD",
        value: "$"
    },
    VND: {
        label: "VNĐ",
        value: "Vnđ"
    }
}

const preStepZTEnum = {
    ROOT: {
        label: "ZoneTable",
        value: "zone-table"
    },
    CREATEORDER: {
        label: "Create",
        value: viewNameEnum.CREATEORDER
    },
    CONFIRMORDER: {
        label: "Confirm",
        value: viewNameEnum.CONFIRM
    },
    SPLITORDER: {
        label: "Split",
        value: viewNameEnum.SPLIT
    },
    MERGEORDER: {
        label: "Merge",
        value: viewNameEnum.MERGE
    },
    BILLINFO: {
        label: "Info",
        value: viewNameEnum.BILLINFO
    },
}

const supportedLocales = [
    {
        label: "Deutsch",
        value: "de",
        flag: "/images/flags/germany_flag.jpg"
    },
    {
        label: "English",
        value: "en",
        flag: "/images/flags/us_flag.jpg"
    },
    {
        label: "Tiếng Việt",
        value: "vi",
        flag: "/images/flags/vietnam_flag.png"
    },
    // {
    //     label: "Português",
    //     value: "po",
    //     flag: "/images/flags/portugal_flag.png"
    // }
];

const localCurrency=localStorage.getItem('restaurantCurrency');
const currentLanguage = localStorage.getItem('restaurentLocale');
const taxPercent = 10.5;

export {
    payTypeEnum,
    statusEnum,
    viewModeEnum,
    allColorEnum,
    viewNameEnum,
    currencyEnum,
    preStepZTEnum,
    supportedLocales,
    localCurrency,
    currentLanguage,
    taxPercent
}