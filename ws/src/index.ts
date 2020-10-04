import IO from "socket.io";

const io = IO();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

io.on("connection", (socket) => {
	console.log("new client");
	socket.on("draw", (data) => {
		socket.broadcast.emit("draw", data);
	});
});

io.listen(PORT);
