import { UserDto } from "./modules/user/dto/user.dto";
import { User } from '@entities/user.entity';

export const toUserDto = (data: User): UserDto => {
  if (!data) {
    return undefined;
  }
  const { id, username, password, mcuToken } = data;

  const userDto: UserDto = {
    id,
    username,
    password,
    mcuToken
  };

  return userDto;
};