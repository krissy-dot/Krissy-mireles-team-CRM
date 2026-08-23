import { Contact, Task } from "./types";

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Whitman",
    phone: "(512) 555-0142",
    email: "sarah.whitman@gmail.com",
    stage: "Showing",
    source: "Zillow",
    interest: "3BD in Round Rock, $400k-$450k",
    lastContact: "2026-08-21",
    activity: [
      { id: "a1", type: "call", summary: "Called to confirm Saturday showing at 214 Maple Ct.", date: "2026-08-21" },
      { id: "a2", type: "text", summary: "Sent listing link for 90 Oakwood Dr.", date: "2026-08-19" },
      { id: "a3", type: "note", summary: "Wants a big backyard, has two dogs.", date: "2026-08-14" },
    ],
  },
  {
    id: "2",
    name: "Marcus Reed",
    phone: "(512) 555-0198",
    email: "marcus.reed@outlook.com",
    stage: "New Lead",
    source: "Website",
    interest: "Investment property, duplex or triplex",
    lastContact: "2026-08-22",
    activity: [
      { id: "a4", type: "note", summary: "Submitted contact form asking about multi-family listings.", date: "2026-08-22" },
    ],
  },
  {
    id: "3",
    name: "The Alvarez Family",
    phone: "(512) 555-0176",
    email: "alvarez.family@icloud.com",
    stage: "Under Contract",
    source: "Referral",
    interest: "4BD in Cedar Park, closing in Sept",
    lastContact: "2026-08-20",
    activity: [
      { id: "a5", type: "email", summary: "Sent inspection report and next steps.", date: "2026-08-20" },
      { id: "a6", type: "call", summary: "Discussed appraisal timeline.", date: "2026-08-17" },
    ],
  },
  {
    id: "4",
    name: "Grace Kim",
    phone: "(512) 555-0113",
    email: "grace.kim@yahoo.com",
    stage: "Contacted",
    source: "Open House",
    interest: "Condo downtown, under $300k",
    lastContact: "2026-08-18",
    activity: [
      { id: "a7", type: "text", summary: "Following up after Sunday open house visit.", date: "2026-08-18" },
    ],
  },
  {
    id: "5",
    name: "Tom & Denise Barrett",
    phone: "(512) 555-0165",
    email: "barrett.family@gmail.com",
    stage: "Closed",
    source: "Referral",
    interest: "Closed on 5 Birchwood Ln in June",
    lastContact: "2026-06-30",
    activity: [
      { id: "a8", type: "note", summary: "Closed! Sent housewarming gift.", date: "2026-06-30" },
    ],
  },
  {
    id: "6",
    name: "Priya Natarajan",
    phone: "(512) 555-0121",
    email: "priya.n@gmail.com",
    stage: "Past Client",
    source: "Zillow",
    interest: "Bought starter home in 2024, may sell to upgrade",
    lastContact: "2026-05-02",
    activity: [
      { id: "a9", type: "call", summary: "Checked in, mentioned they may list next spring.", date: "2026-05-02" },
    ],
  },
];

export const tasks: Task[] = [
  { id: "t1", contactId: "1", title: "Confirm Saturday showing time", dueDate: "2026-08-23", done: false },
  { id: "t2", contactId: "2", title: "Call new lead from website", dueDate: "2026-08-23", done: false },
  { id: "t3", contactId: "3", title: "Follow up on appraisal", dueDate: "2026-08-24", done: false },
  { id: "t4", contactId: "4", title: "Send condo listings under $300k", dueDate: "2026-08-25", done: false },
  { id: "t5", contactId: "6", title: "Check in about spring listing", dueDate: "2026-08-28", done: false },
];
