require("dotenv").config();

const emailAPI = require("sib-api-v3-sdk");
const client = emailAPI.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const sendTicketEmail = async ({
  users,
  eventName,
  EventPic,
  ArtistName,
  eventdate,
  ticketprice,
  description,
}) => {
  const emails = users.map((user) => ({
    email: user.email,
  }));

  let mail = new emailAPI.TransactionalEmailsApi();
  const sendSmtpEmail = new emailAPI.SendSmtpEmail();
  sendSmtpEmail.templateId = 1;
  sendSmtpEmail.to = emails;
  sendSmtpEmail.params = {
    eventName: eventName,
    eventPic: EventPic,
    artistName: ArtistName,
    eventDate: eventdate,
    ticketPrice: ticketprice,
    escription: description,
  };
  try {
    await mail.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log(
          "API called successfully. Returned data: " + JSON.stringify(data)
        );
      },
      function (error) {
        console.error(error);
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendTicketEmail;
