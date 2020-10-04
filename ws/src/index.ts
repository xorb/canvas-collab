import IO from "socket.io";

const io = IO();

io.on("connection", (socket) => {
	console.log("new client");
	socket.on("draw", (data) => {
		socket.broadcast.emit("draw", data);
	});
});

io.listen(8080);
