import path from "path";
import fs from "fs";

function buildPath() {
  return path.join(process.cwd(), "data", "data.json");
}

function extractData(filePath) {
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export default function handler(req, res) {
  const { method } = req;
  const filePath = buildPath();
  const { allEvents, events_categories } = extractData(filePath);
  if (!allEvents) {
    res.status(404).json({ message: "Events data not found" });
    return;
  }

  if (method === "POST") {
    const { email, eventId } = req.body;

    if (!email | !email.includes("@")) {
      res.status(422).json({ message: "Invalid email address" });
    }

    const newAllEvents = allEvents.map((ev) => {
      if (ev.id === eventId) {
        if (ev.emails_registered.includes(email)) {
          res
            .status(409)
            .json({ message: "This email has already been registered" });
        }
        return {
          ...ev,
          emails_registered: [...ev.emails_registered, email],
        };
      }
      return ev;
    });

    fs.writeFileSync(
      filePath,
      JSON.stringify({ events_categories, allEvents: newAllEvents })
    );

    res.status(200).json({
      message: `You have been successfully registered with the email ${email} for the event ${eventId}`,
    });

    // if (!email || !email.includes("@") || !eventId) {
    //     res.status(422).json({ message: "Invalid input" })
    //     return
    // }
    // const newRegistration = {
    //     id: new Date().toISOString(),
    //     email,
    //     eventId,
    // }
    // console.log(newRegistration)
    // res.status(201).json({ message: "Registered!" })
  }
}
