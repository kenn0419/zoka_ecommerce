export class UserMapper {
  static toUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      slug: user.slug,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
      status: user.status,
      roles: (user.roles ?? []).map((ur: any) => {
        const role = ur.role ?? ur;
        return {
          name: role.name,
          desription: role?.description ?? '',
        };
      }),
    };
  }
}
