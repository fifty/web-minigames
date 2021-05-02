import { Socket } from 'socket.io';
import { Listener } from '../listener';
import { SocketEvents } from '@wmg/shared';
import LobbyHelper from '../helpers/lobby-helper';

export class LobbyCreate extends Listener {
  constructor() {
    super(SocketEvents.LOBBY_CREATE);
  }

  async handle(socket: Socket) {
    LobbyHelper.create(socket);
  }
}
