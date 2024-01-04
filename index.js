const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// إضافة الموديل الخاص بالمستخدم
const User = mongoose.model("User", {
  fullname: String,
  username: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false }, // حقل لتحديد نوع المستخدم مع قيمة افتراضية
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// إعداد البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "mahmoodnaser716@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN,
  },
});

// رمز عشوائي
function generateRandomCode() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// نقطة النهاية لطلب إعادة كلمة المرور
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("البريد الإلكتروني غير موجود.");
    }

    const token = generateRandomCode();
    user.resetPasswordToken = token.toString();

    const userLocalTime = new Date();
    user.resetPasswordExpires = userLocalTime.getTime() + 2 * 60 * 1000; // 2 دقيقة

    await user.save();

    const resetPasswordMessage = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:520px) {
			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; background-size: auto; background-image: none; background-position: top left; background-repeat: no-repeat;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #333; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; border-bottom: 0 solid #DA2222; border-left: 0 solid #DA2222; border-radius: 4px; border-right: 0px solid #DA2222; border-top: 0 solid #DA2222; color: #000000; width: 500px; margin: 0 auto;" width="500">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 5px; padding-right: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 125px;"><img src="https://app-rsrc.getbee.io/public/resources/defaultrows/1.png" style="display: block; height: auto; border: 0; width: 100%;" width="125" alt="I'm an image" title="I'm an image"></div>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:24px;color:#ffffff;"><strong>إعادة تعيين كلمة المرور</strong></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:15px;color:#ffffff;"><strong>لإعادة تعيين كلمة المرور، يرجى استخدام الرمز التالي</strong></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table class="html_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;text-align:center;" align="center">
<html>
<head>
  <meta />
  <title>Copy Text on Click</title>
  <style>
    .code-box {
      font-size: 24px;
      color: #fff
    }
  </style>
</head>


<div class="code-box">
  <p class="code-text"><strong>${token}</strong></p>
</div>




</html>
</div>
															</td>
														</tr>
													</table>
													<table class="text_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="font-size:14px;color:#ffffff;"><strong>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة</strong></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px; letter-spacing: normal;"><span style="color:#ffffff;">&nbsp;سوف يتم انتها صلاحية رمز بعد دقيقتان</span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
													<table class="text_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="color:#ffffff;"><strong><span style="font-size:17px;">شكرًا لاستخدام موقع <span style>تايم <span style="color:#23a112;">هوست</span></span></span></strong></span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>`;

    await transporter.sendMail({
      from: "mahmoodnaser716@gmail.com",
      to: email,
      subject: "إعادة تعيين كلمة المرور",
      html: resetPasswordMessage,
    });

    setTimeout(
      async () => {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      },
      2 * 60 * 1000,
    ); // 2 دقيقة

    res.status(200).json({
      message: "تم إرسال رمز إعادة تعيين كلمة المرور إلى البريد الإلكتروني.",
    });
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء طلب إعادة تعيين كلمة المرور.");
  }
});

// نقطة النهاية لتغيير كلمة المرور
// نقطة النهاية لتغيير كلمة المرور
app.post("/change-password", async (req, res) => {
  try {
    const { resetCode, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: resetCode,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "invalidCode",
        message: "رمز إعادة تعيين كلمة المرور غير صالح.",
      });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        error: "expiredCode",
        message: "انتهت صلاحية رمز إعادة تعيين كلمة المرور.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح!" });
  } catch (error) {
    res.status(500).json({
      error: "internalError",
      message: "حدث خطأ أثناء تغيير كلمة المرور.",
    });
  }
});

// POST endpoint لاستقبال بيانات المستخدم الجديد
app.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // التحقق من الحد الأدنى والأقصى لاسم المستخدم
    if (username.length < 9 || username.length > 16) {
      return res.status(400).send("يجب أن يكون اسم المستخدم بين 9 و16 حرفًا.");
    }

    // التحقق من وجود حروف كبيرة وصغيرة في اسم المستخدم
    if (!(/[a-z]/.test(username) && /[A-Z]/.test(username))) {
      return res
        .status(400)
        .send("يجب أن يحتوي اسم المستخدم على أحرف كبيرة وصغيرة.");
    }

    // التحقق من السماح بالأحرف الخاصة
    const validUsername = /^[a-zA-Z0-9_@-]+$/.test(username);
    if (!validUsername) {
      return res
        .status(400)
        .send("يجب أن يحتوي اسم المستخدم على الأحرف المسموح بها فقط.");
    }

    // إنشاء مستخدم جديد باستخدام النموذج وحفظه في قاعدة البيانات
    const user = new User({ fullname, username, email, password });
    await user.save();

    res.status(201).send("تم تسجيل المستخدم بنجاح!");
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء تسجيل المستخدم.");
  }
});

// POST endpoint لعملية تسجيل الدخول
// POST endpoint لعملية تسجيل الدخول
// POST endpoint لعملية تسجيل الدخول
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).send("البريد الإلكتروني غير صحيح.");
    } else {
      if (user.password !== password) {
        res.status(401).send("كلمة المرور غير صحيحة.");
      } else {
        res.status(200).send("تم تسجيل الدخول بنجاح!");

        // إرسال نوع المستخدم (مسؤول أم عادي) مع الرد
        res.json({ isAdmin: user.isAdmin });
      }
    }
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء عملية تسجيل الدخول.");
  }
});

app.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء التحقق من البريد الإلكتروني.");
  }
});

// POST endpoint لاسترداد بيانات المستخدم
app.post("/user-data", async (req, res) => {
  try {
    const { email } = req.body;

    const userData = await User.findOne(
      { email },
      { username: 1, email: 1, password: 1, isAdmin: 1 }, // يتم استرداد نوع المستخدم هنا
    );

    if (!userData) {
      res.status(404).send("لم يتم العثور على معلومات المستخدم.");
    } else {
      res.status(200).json(userData);
    }
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء جلب معلومات المستخدم.");
  }
});

app.get("/get_accounts", async (req, res) => {
  try {
    const accounts = await User.find(
      {},
      { username: 1, email: 1, isAdmin: 1, password: 1 },
    );

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ message: "لا توجد معلومات حسابات متاحة." });
    }

    res.status(200).json({ accounts });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء جلب معلومات الحسابات." });
  }
});

app.delete("/delete_account", async (req, res) => {
  const { email } = req.query;

  try {
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "الحساب غير موجود." });
    }

    res.status(200).json({ success: true, message: "تم حذف الحساب بنجاح." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "حدث خطأ أثناء حذف الحساب." });
  }
});

app.put("/change_user_role/:userId", async (req, res) => {
  const { userId } = req.params;
  const { isAdmin } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { isAdmin },
      { new: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "المستخدم غير موجود." });
    }

    res
      .status(200)
      .json({ success: true, message: "تم تحديث دور المستخدم بنجاح." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "حدث خطأ أثناء تحديث دور المستخدم." });
  }
});

// تشغيل الخادم على المنفذ المحدد
app.listen(port, () => {
  console.log(`... ${port} ﺬﻔﻨﻤﻟﺍ ﻰﻠﻋ ﻉﺎﻤﺘﺳﻻﺍ ﻢﺘﻳ`);
});
