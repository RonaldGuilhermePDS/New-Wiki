---
title: General System Tweaks
description: Things you can do to tweak after installing
published: 1
date: 2023-02-07T17:33:51.663Z
tags: information, performance
editor: markdown
dateCreated: 2022-07-26T18:23:44.222Z
---

# General System Tweaks


1\. Reduce Swappiness and vfs_cache_pressure
--------------------------------------------

The system's swap space preference can be adjusted using the `vm.swappiness` sysctl parameter. The default value is "30", which means that the kernel will avoid swapping processes to disk as much as possible and will instead try to keep as much data as possible in memory. A lower swappiness value generally leads to improved performance but may lead to decreased stability if the system runs out of memory.

The `vm.vfs_cache_pressure` is a kernel parameter that sets the tendency of the kernel to reclaim inode and dentry cache. By default, it is set to "100" and a lower value means the kernel will tend to cache more inode and dentry information in memory. To improve performance, you can try to lower the value of `vm.vfs_cache_pressure` to improve file system performance by having more file system metadata cached in memory.

Both values can be changed in the `/etc/sysctl.d/99-cachyos-settings.conf` file.

2\. Editing mkinitcpio.conf for faster boot times
-------------------------------------------------

Replace udev with systemd for faster boots and set compression algorithm to zstd and compression level to 2 because compression ratio increase isn't worth the increased latency.

(bellow isnt the whole file, just the parts that needs changes)
```ini
HOOKS="base systemd autodetect...

COMPRESSION="zstd"
COMPRESSION_OPTIONS=(-2)
```

3\. Zram or Zswap tweaking
--------------------------

Zswap is a kernel feature that caches swap pages in RAM, compressing them before storing. It improves performance by reducing disk I/O when the system needs to swap.
Zram is a RAM-based swap device that does not require a backing swap device.

For zswap, use the following recommended configurations:

```C
# echo zstd > /sys/module/zswap/parameters/compressor
# echo 10 > /sys/module/zswap/parameters/max_pool_percent
```

To make the changes persist, add `zswap.compressor=zstd zswap.max_pool_percent=10` to your bootloader's kernel command line options

For SSDs, set the `page-cluster` value to 1 in `/etc/sysctl.d/99-cachyos-settings.conf`. For HDDs, set it to 2.

4\. CPU Mitigations for retbleed
--------------------------------

A public speculative execution attack exploiting return instructions (retbleed) was revealed in July 2022. The kernel has fixed this, but it results in a significant performance overhead (14-39%).

The following CPU's are affected:

*   AMD: Zen 1, Zen 1+, Zen 2
*   Intel: 6th to 8th Generation, Skylake, Caby Lake, Coffee Lake

Check which mitigations your CPU is affected by: `grep . /sys/devices/system/cpu/vulnerabilities/*`

### Disabling mitigations

While disabling the mitigations increases performance, it also introduces security risks.
> Do so at your own risk.
{.is-info}


Add the following to your kernel command line: `retbleed=off` or to disable all mitigations: `mitigations=off`

Edit the appropriate file to persist the changes:

*   GRUB: `/etc/default/grub`
*   systemd boot: `/etc/sdboot-manage.conf`

> Note: Disabling these mitigations poses a security risk to your system.
{.is-warning}

For more information:

*   https://www.phoronix.com/review/retbleed-benchmark
*   https://www.phoronix.com/review/xeon-skylake-retbleed

5\. AMD PSTATE (EPP) Driver
---------------------------

For improved performance and power efficiency, you can enable the AMD PSTATE EPP driver. The default AMD PSTATE driver may not provide the same benefits as the acpi-cpufreq driver.

Add one of the following options to your kernel command line:

*   AMD PSTATE: `amd_pstate=passive`
*   AMD PSTATE-GUIDED: `amd_pstate=guided`
*   AMD PSTATE EPP: `amd_pstate=active`

You can switch between modes at runtime to test the options:

*   `echo active | sudo tee /sys/devices/system/cpu/amd_pstate/status` - Autonomous mode, platform considers only the values set for Minimum performance, Maximum performance, and Energy Performance Preference.

*   `echo guided | sudo tee /sys/devices/system/cpu/amd_pstate/status` - Guided-autonomous mode, platform sets operating performance level according to the current workload and within limits set by the OS through minimum and maximum performance registers.

*   `echo passive | sudo tee /sys/devices/system/cpu/amd_pstate/status` - Non-autonomous mode, platform gets desired performance level from OS directly through Desired Performance Register.

For more information:

*   [https://lore.kernel.org/lkml/20221110175847.3098728-1-Perry.Yuan@amd.com/](https://lore.kernel.org/lkml/20221110175847.3098728-1-Perry.Yuan@amd.com/)
*   [https://lore.kernel.org/lkml/20230119115017.10188-1-wyes.karny@amd.com/](https://lore.kernel.org/lkml/20230119115017.10188-1-wyes.karny@amd.com/)

6\. Using AMD PSTATE EPP
------------------------

To use the AMD PSTATE EPP, there are two CPU frequency scaling governors available: powersave and performance. It is recommended to use the powersave governor and set a preference.

*   Set powersave governor: `sudo cpupower frequency-set -g powersave`
*   Set performance governor: `sudo cpupower frequency-set -g performance`

To set a preference, run the following command with the desired preference:

`echo power | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference`

Available preferences: `performance`, `power`, `balance_power`, `balance_performance`

Benchmarks for each preference can be found here:
[https://lore.kernel.org/lkml/20221219064042.661122-1-perry.yuan@amd.com/](https://lore.kernel.org/lkml/20221219064042.661122-1-perry.yuan@amd.com/)

7\. Disabling Split Lock Mitigate
---------------------------------

In some cases, split lock mitigate can slow down performance in applications and games. A patch is available to disable it via sysctl.

*   Disable split lock mitigate: `sudo sysctl kernel.split_lock_mitigate=0`
*   Enable split lock mitigate: `sudo sysctl kernel.split_lock_mitigate=1`

To set the value permanently, add the following line to `/etc/sysctl.d/99-splitlock.conf`:

`kernel.split_lock_mitigate=0`

For more information on split lock, see:

*   [https://www.phoronix.com/news/Linux-Splitlock-Hurts-Gaming](https://www.phoronix.com/news/Linux-Splitlock-Hurts-Gaming)
*   [https://github.com/doitsujin/dxvk/issues/2938](https://github.com/doitsujin/dxvk/issues/2938)