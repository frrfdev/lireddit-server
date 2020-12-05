import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import {
  passwordEmpty,
  passwordIncorrect,
  usernameDuplicated,
  usernameEmpty,
  usernameNotFound,
} from "src/utils/errorMessages";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { id });
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    const id = req.session.userId;
    if (id) {
      const user = await em.findOne(User, { id });

      if (user) return user;
    }

    return null;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (!options.username)
      return {
        errors: [{ message: usernameEmpty, field: "username" }],
      };

    if (!options.password)
      return {
        errors: [{ message: passwordEmpty, field: "password" }],
      };

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (error) {
      // duplicated error
      if (error.code === "23505" || error.detail.includes("already exists")) {
        return {
          errors: [{ message: usernameDuplicated, field: "username" }],
        };
      }
    }

    return { user };
  }

  @Query(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user)
      return {
        errors: [{ field: "username", message: usernameNotFound }],
      };

    const valid = await argon2.verify(user.password, options.password);

    if (!valid)
      return {
        errors: [{ field: "password", message: passwordIncorrect }],
      };

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("username") username: string,
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    const user = await em.findOne(User, { id });

    if (!user) return null;

    if (typeof username !== undefined) {
      user.username = username;
      await em.persistAndFlush(user);
    }

    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(User, { id });

    return true;
  }
}
