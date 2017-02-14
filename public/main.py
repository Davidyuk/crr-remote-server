from socketIO_client import SocketIO
from time import sleep
from subprocess import Popen, PIPE
from threading import Thread

io = SocketIO('localhost', 4000)
io.emit('auth', 'test2')
proc = Popen('git', stdin=PIPE, stdout=PIPE, stderr=PIPE)
consoleSend = ''


def receive_console_buffer():
    global consoleSend
    while not proc.stdout.closed:
        out = proc.stdout.read(1).decode('cp866')
        consoleSend += out
        # print('"', out, '"')
    print('File is closed')
Thread(target=receive_console_buffer).start()


def send_console_buffer():
    global consoleSend
    while True:
        if consoleSend:
            print(consoleSend)
            io.emit('console', consoleSend)
            consoleSend = ''
        sleep(0.2)
Thread(target=send_console_buffer).start()


def on_console(console):
    if console == '\r':
        console = '\r\n'
    print('"', console, '"')
    # print(console, ord(console[0]), len(console))
    content = console.encode('cp866')
    proc.stdin.write(content)
    proc.stdin.flush()

io.on('console', on_console)

while True:
    io.wait(seconds=1)
