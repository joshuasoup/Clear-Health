db.users.insertOne({
  sessionId: "unique_session_id",
  pdfs: [
    { title: "PDF Title 1", url: "http://example.com/pdf1.pdf", uploadDate: new Date() },
    { title: "PDF Title 2", url: "http://example.com/pdf2.pdf", uploadDate: new Date() }
    // ... you can add as many PDFs as you like
  ]
});

db.users.findOne({ sessionId: "unique_session_id" });

db.users.updateOne(
  { sessionId: "unique_session_id" },
  { $push: { pdfs: { title: "PDF Title 3", url: "http://example.com/pdf3.pdf", uploadDate: new Date() } } }
);
