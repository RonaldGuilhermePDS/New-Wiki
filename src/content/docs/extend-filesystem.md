---
title: How to Resize an ext2/3/4 Filesystem
description: ''
published: 1
date: 2022-01-13T14:38:27.308Z
tags: filesystem, storage
editor: ckeditor
dateCreated: 2022-01-11T18:15:31.243Z
icon: heroicons-solid:home
---

## **Prerequisits**

-   * A created partition that you know the name of. To check the name,
    run **sudo fdisk -l***.

 

## **Procedure**

**1.** If the partition the filesystem is on is currently mounted,
unmount it.

For example:

``` plaintext
sudo umount /dev/nvme0n1p1
sudo umount /dev/nvme0n1p2
```

**2.** Run **fdisk** ***disk_name***.

For example:

``` plaintext
sudo fdisk /dev/nvme0n1
```

**3.** Check the partition number you wish to delete with the **p**. The
partitions are listed under the heading "Device".

For example:

``` plaintext
Command (m for help): p
Disk /dev/nvme0n1: 465.76 GiB, 500107862016 bytes, 976773168 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 8f5bd174-9014-47cb-a8fb-b635976c66ca
Device            Start       End   Sectors   Size Type
/dev/nvme0n1p1     2048   1050623   1048576   512M EFI System
/dev/nvme0n1p2 34605056 976773134 942168079 449.3G Linux filesystem
```

**4.** Use the option **d** to delete a partition. If there is more than
one, **fdisk** prompts for which one to delete. 

For example:

``` plaintext
Command (m for help): d
Partition number (1,2, default 2): 2 
Partition 2 has been deleted.
```

**5.** Use the option **n** to create a new partition. Follow the
prompts and ensure you allow enough space for any future resizing that
is needed. It is possible to specify a set, human-readable size instead
of using sectors if this is preferred.

> *Note:* It is recommended to follow **fdisk**'s defaults as the
> default values (for example, the first partition sectors) and
> partition sizes specified are always aligned according to the device
> properties.

> ***Warning:*** If you are recreating a partition in order to allow for
> more room on a mounted file system, ensure you create it with the same
> starting disk sector as before. Otherwise the resize operation will
> not work and the entire file system may be lost.

For example:

``` plaintext
Command (m for help): n 
Partition type: 
  p  primary (1 primary, 0 extended, 3 free) 
  e  extended 
Select (default p): *Enter* 
Using default response p. 
Partition number (2-4, default 2): *Enter*
First sector (1026048-854745087, default 1026048): *Enter* 
Last sector, +sectors or +size{K,M,G,T,P} (1026048-854745087, default 854745087): +463G

Created a new partition 2 of type 'Linux' and of size 463 GiB.
```

**6.** Check the partition table to ensure that the partitions are
created as required using the **p** option.

For example:

``` plaintext
Command (m for help): p
Disk /dev/nvme0n1: 465.76 GiB, 500107862016 bytes, 976773168 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 8f5bd174-9014-47cb-a8fb-b635976c66ca
Device            Start       End   Sectors   Size Type
/dev/nvme0n1p1     2048   1050623   1048576   512M EFI System
/dev/nvme0n1p2 34605056 976773134 942168079   463G Linux filesystem
```

**7.** Write the changes with the **w** option when you are sure they
are correct.

> ***Important***: Errors in this process that are written could cause
> instability with the selected file system.

**8.** Extend the file system with the **resize2fs** ***/dev/device
size*** command.

> *Note:* If you are resizing a partition in order to fill all available
> space use **resize2fs** ***/dev/device***

> ***Important***: **size** cannot be more than allocated space. For
> example size cannot be more than *463G*

For example:

``` plaintext
sudo resize2fs /dev/nvme0n1p2 463G
```

Accepted size units for file system block sizes are: \
\
S - 512 byte sectors \
K - kilobytes \
M - megabytes \
G - gigabytes

 

## **More Information**

-   **man fdisk**
-   **man resize2fs**
