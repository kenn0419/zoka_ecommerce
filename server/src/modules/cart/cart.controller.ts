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

@Controller('cart')
@UseGuards(JwtSessionGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post('add')
  addToCart(
    @Req() req,
    @Body() body: { productId: string; variantId?: string; quantity: number },
  ) {
    return this.cartService.addToCart(
      req.user.id,
      body.productId,
      body.variantId || null,
      body.quantity,
    );
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
