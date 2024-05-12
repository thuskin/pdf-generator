console.log("Starting");

import PDFDocument, { lineGap } from "pdfkit";
import * as fs from "fs";
import { width } from "pdfkit/js/page";

const doc = new PDFDocument({size: 'A4', bufferPages: true, margins: {top: 100, bottom: 10, left: 50, right: 50}});
const writeStream = fs.createWriteStream('./output/file.pdf');
doc.image("./logo/Bosch.png", doc.page.width - 150, 20, {height: 30 });
doc.fontSize(7);
doc.text("Bosch Corporation", 480, 100, {align: "left"});
doc.text("1-9-32, Nakagawachuo,");
doc.text("Tsuzuki-ku,");
doc.text("Yokohama-shi, Kanagawa,");
doc.text("224-8601");
doc.text("Japan");
doc.text("www.bosch.co.jp");
doc.text("The symbol and the Bosch logotype are registered", 50, 800, {align: "left"});
doc.text("trademarks of Robert Bosch GmbH, Germany");
doc.fontSize(10);
doc.on('pageAdded', () => {
    doc.image("./logo/Bosch.png", doc.page.width - 150, 20, {height: 30 });
});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("ボッシュ株式会社 横浜本社お越しのお客様へ", 50, 50, {width: 400});
doc.text("Parking Information for Customers Visiting Bosch Corporation Yokohama", {width: 400});
doc.text("Headquarters", {width: 400});
doc.moveDown(6);
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("駐車場のご案内(Parking Information)");
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.moveDown();
doc.text("ボッシュ株式会社横浜本社の地下駐車場予約を以下の通り承りました", {width: 400});
doc.text("駐車場の数が限られているため、駐車スペースを指定させていただきます", {width: 400});
doc.text("車両の入館ゲートは車両番号による自動認証になっております 事前に予約内容", {width: 400});
doc.text("をご確認の上、指定されたスペースへの駐車をお願いいたします", {width: 400});
doc.text("We are pleased to inform you that we have reserved a parking space for your visit at Bosch Corporation Yokohama Headquarters. Due to the limited number of parking spaces available, we have assigned a specific parking slot for your convenience. To ensure a smooth entry, the parking gate will open automatically based on the registered car number plate information. Please take a moment to verify the registered information provided below before your visit at Bosch Corporation Yokohama Headquarters. On the day of your visit, please park your vehicle in the designated parking space.", {width: 400});
doc.text("We sincerely appreciate your understanding and cooperation, and we hope you have a pleasant visit to Bosch Corporation Yokohama Headquarters.", {width: 400});
doc.moveDown();
doc.text("-----------------------------------------------------------------------------------");
doc.moveDown();
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("【駐車場情報】");
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.moveDown();
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("施設名称: ", {continued: true});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("ボッシュ株式会社 横浜本社 地下駐車場(地下2階)");
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("郵便番号: ", {continued: true});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("224-8601");
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("住所: ", {continued: true});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("神奈川県横浜市都筑区中川中央1丁目9番32号");
doc.moveDown();
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("【Parking Information】", {width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.moveDown();
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("Facility Name: ", {continued: true, width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("Bosch Corporation Headquarters Basement Parking Lot(B2F)", {width: 400});
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("Postal Code: ", {continued: true, width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("224-8601", {width: 400});
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("Address:  ", {continued: true, width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("1-9-32 Nakagawa Chuo, Tsuzuki-ku, Yokohama-shi, Kanagawa Prefecture", {width: 400});
doc.moveDown();
doc.text("------------------------------------------------------------------------------");
doc.moveDown();
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("【予約詳細/Reservation Details】");
doc.text("予約ID/Reservation ID：", {continued: true, width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("ABC", {width: 400});
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("予約日時/Reservation Date and Time：", {continued: true, width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("ABC", {width: 400});
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("予約車室番号/Parking Lot no.：", {continued: true, width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("ABC", {width: 400});
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("登録車両/Registered Car Number Plate: ", {continued: true, width: 400});
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.text("ABC", {width: 400});
doc.moveDown();
doc.text("------------------------------------------------------------------------------");
doc.moveDown();
doc.addPage();
doc.image("./images/map.png", {height: 220});
doc.moveDown();
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("【駐車場ご利用にあたっての注意事項】");
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.moveDown();
doc.list([
    "前の予約車や次の予約車がいるので利用時間を守ってください",
    "私用での利用はお断りしております",
    "駐車場内での車両整備はお断りしております",
    "駐車場内で発生した事故、破損、盗難等についての補償は行われません",
    "利用者様が駐車場の場内で起こした事故や破損について、修繕費用は利用車様にご負担いただきます",
    "駐車場内で怪我や事故が起きた場合は速やかに管理者へご連絡ください",
    "構内では下記ルールを守って頂くようお願いいたします"
], {listType: "numbered", indent: 20, bulletIndent:20, textIndent:20, paragraphGap: 1, align: "left", width: 400});
doc.list([
    "歩行者の歩行を妨げない", 
    "歩道などで一時停止と安全確認", 
    "場内追い越し禁止", 
    "場内の運転は時速10km以下"],
    {listType: "bullet", indent: 40, bulletIndent:20, textIndent:20, paragraphGap: 1, align: "left", width: 400});
doc.moveDown();
doc.font("./fonts/BIZUDPGothic-Bold.ttf");
doc.text("【Important Notes】");
doc.font("./fonts/BIZUDPGothic-Regular.ttf");
doc.moveDown();
doc.list([
    "We kindly request that you strictly adhere to the reserved time slot, as there may be other reservations before and after yours",
    "Please note that the parking lot is exclusively designated for guest use, and private use is strictly prohibited",
    "To ensure a safe and efficient parking environment, it is not permitted to carry out vehicle maintenance activities",
    "Please be aware that Bosch Corporation will not be held liable for any accidents, damages, theft, or incidents that may occur within the parking lot",
    "In the event of any accidents or damages caused by the user within the parking lot, the repair costs will be the responsibility of the user",
    "Should you encounter any injuries or accidents within the parking lot, please immediately contact the administrator for prompt assistance",
    "We kindly request your cooperation in observing the following rules while in the parking lot:"], 
    {listType: "numbered", indent: 20, bulletIndent:20, textIndent:20, paragraphGap: 1, align: "left", width: 400});
doc.list([
    "Please refrain from obstructing pedestrian traffic", 
    "When making temporary stops, ensure the safety of pedestrians on sidewalks before proceeding", 
    "Overtaking other vehicles within the parking lot is strictly prohibited", 
    "Please drive within the parking lot at a speed of 10km/h or below"],
    {listType: "bullet", indent: 40, bulletIndent:20, textIndent:20, paragraphGap: 1, align: "left", width: 400});
let pages = doc.bufferedPageRange();
console.log(pages.count);
//End content
doc.pipe(writeStream); // write to PDF

doc.flushPages();
// finalize the PDF and end the stream
doc.end();