import { postData } from "./FetchApi";
import api from "../config/api.json"
import Swal from "sweetalert2";
import moment from "moment";
export function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

export async function createCheckout({ retailerId, orderType, pricingType }) {
    let configData = {
        retailerId: retailerId,
        orderType: orderType,
        pricingType: pricingType
    }
    let response = await postData(api.checkout.createCheckout, configData);
    if (response.status == 200) {
        let data = response.data?.createCheckout;
        localStorage.setItem('checkoutId', data?.id);
        return data?.id;
    } else {
        return "";
    }
}

export function showLoader() {
    Swal.fire({
        title: 'Processing...'
    });
    Swal.showLoading();
}

export function redirectURL() {
    let path = '';
    if (typeof window !== 'undefined') {
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            path = 'http://localhost:3002/success'
            return path;
        } else {
            path = 'https://www.jarscannabis.com//success'
            return path;
        }
    }
}

export function formatDate(date) {
    return moment(String(date)).format('MM.DD.YYYY');
}

export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        let text = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        if (text.includes("_")) {
            let str = text.split("_");
            let final_str = "";
            for (let i = 0; i < str?.length; i++) {
                let new_str = str[i].charAt(0).toUpperCase() + str[i].substr(1).toLowerCase();
                final_str += new_str + ' ';
            }
            return final_str;
        }
        return text
    });
}

export function countPostedTime(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now - date;

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (diff < minute) {
        return 'just now';
    } else if (diff < hour) {
        const minutesAgo = Math.floor(diff / minute);
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else if (diff < day) {
        const hoursAgo = Math.floor(diff / hour);
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else if (diff < month) {
        const daysAgo = Math.floor(diff / day);
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (diff < year) {
        const monthsAgo = Math.floor(diff / month);
        return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    } else {
        const yearsAgo = Math.floor(diff / year);
        return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
    }
}

export function urlSlug(title) {
    let slug;

    // Convert to lower case
    slug = title.toLowerCase();

    // Remove special characters
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\?|\>|\<|\'|\"|\:|\;|/gi, "");

    // Replace spaces with dash symbols
    slug = slug.replace(/ /gi, "-");

    // Replace forward slash with dash symbols
    slug = slug.replace(/\//gi, "-");

    // Replace dot with dash symbols
    slug = slug.replace(/\./gi, "-");

    // Remove consecutive dash symbols
    slug = slug.replace(/\-\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-/gi, "-");
    slug = slug.replace(/\-\-/gi, "-");

    // Remove the unwanted dash symbols at the beginning and the end of the slug
    slug = "@" + slug + "@";
    slug = slug.replace(/\@\-|\-\@|\@/gi, "");

    return slug;
}

function removeLeadingTrailingSubstring(inputString, substringToRemove) {
    if (typeof inputString !== 'string') {
        return inputString; // Return input as-is if not a string
    }

    const regex = new RegExp(`^${substringToRemove}|${substringToRemove}$`, 'g');
    return inputString.replace(regex, '');
}

export function retialerNameSlug(name) {
    // return name?.toLowerCase()?.replace(/[\s\W]/g, '-')?.replace('---', '-');
    let urlSlug = name?.toLowerCase()?.replace(/[\s\W]/g, '-')?.replace('---', '-');
    let lessCannabisURLSlug = urlSlug?.split('jars-cannabis-');
    let lessLastHaifen = lessCannabisURLSlug?.length > 0 && removeLeadingTrailingSubstring(lessCannabisURLSlug[1], '-');
    return lessLastHaifen;
}

export function isValidUSMobileNumber(number) {
    // Regular expression to validate US mobile number format
    const usMobileNumberRegex = /^(\+?1\s?)?(\()?\d{3}(\))?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return usMobileNumberRegex.test(number);
}

export function removeUSCountryCode(number) {
    // Regular expression to extract digits only
    const digitsOnlyRegex = /^(\+?1\s?)?(\()?(\d{3})(\))?[.\s-]?(\d{3})[.\s-]?(\d{4})$/;
    const digitsOnlyMatch = number.match(digitsOnlyRegex);
    if (digitsOnlyMatch) {
        const [, , , areaCode, , firstPart, secondPart] = digitsOnlyMatch;
        return areaCode ? `${areaCode}${firstPart}${secondPart}` : `${firstPart}${secondPart}`;
    }
    return '';
}