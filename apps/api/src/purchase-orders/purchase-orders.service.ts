import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import {PrismaService} from "../prisma.service";
import {PurchaseOrders, PurchaseOrderLineItems} from "@prisma/client";

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {
  }

  async create(createPurchaseOrderDto) {
    console.log(createPurchaseOrderDto)
    const po = {"data":{...createPurchaseOrderDto}};
    po.data.order_date = new Date(po.data.order_date)
    po.data.expected_delivery_date = new Date(po.data.expected_delivery_date)
    delete po.data.items;
    const purchase_order =  await this.prisma.purchaseOrders.create(po)
    
    const poLineItems = []
    if (createPurchaseOrderDto.items.length){
      createPurchaseOrderDto.items.map(item =>{
        if( +item.quantity > 0){
          poLineItems.push({
            purchase_order_id: purchase_order.id,
            item_id: item.id,
            quantity: item.quantity,
            unit_cost: item.price

          })
        }
      })
      await this.prisma.purchaseOrderLineItems.createMany({data:poLineItems})
    }

    return purchase_order;
  }

  async findAll(): Promise<PurchaseOrders[]> {
    return this.prisma.purchaseOrders.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrder`;
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
