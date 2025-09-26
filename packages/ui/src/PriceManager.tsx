import React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './table';

export const PriceManager: React.FC = () => {
  // This is a basic implementation. You'll want to add state management and API calls as needed.
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Price Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Input id="product" placeholder="Select product" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Update Price</Button>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableCaption>A list of your products and their current prices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Basic Plan</TableCell>
                    <TableCell>$9.99</TableCell>
                    <td className="text-green-500">Active</td>
                    <td className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      <Button variant="outline" size="sm">History</Button>
                    </td>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pro Plan</TableCell>
                    <TableCell>$19.99</TableCell>
                    <td className="text-green-500">Active</td>
                    <td className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      <Button variant="outline" size="sm">History</Button>
                    </td>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};