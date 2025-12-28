import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { AddCartDto } from './dto/add-cart.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { CartResponseDto } from './dto/cart-response.dto';

@Controller('cart')
@UseGuards(JwtSessionGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Serialize(CartResponseDto, 'Get card successfully')
  getCart(@Req() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post('add')
  @Serialize(CartResponseDto, 'Item added to cart successfully')
  addToCart(@Req() req, @Body() data: AddCartDto) {
    return this.cartService.addToCart(req.user.id, data);
  }

  @Delete('remove/:id')
  removeFromCart(@Param('id') cartItemId: string) {
    return this.cartService.removeFromCart(cartItemId);
  }

  @Delete('clear')
  clearCart(@Req() req) {
    return this.cartService.clearUserCart(req.user.id);
  }
}
